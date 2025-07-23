// server/data/user-service.js

// Lazy load MongoDB to save memory if not used
let MongoClient = null;

import { 
  DATABASE_CONFIG, 
  shouldUseMongoDb, 
  isFallbackEnabled,
  getMongoDbUri,
  getMongoDbDatabase,
  getMongoDbCollection,
  getMongoDbOptions,
  logDatabaseConfig
} from '../config/database.js';

// Import existing user generation functions
import { loadUsers, generateUser } from './users.js';

/**
 * UserService - Abstraction layer for user data operations
 * Supports both MongoDB and JSON file fallback
 */
export class UserService {
  constructor() {
    this.mongoClient = null;
    this.mongoDb = null;
    this.mongoCollection = null;
    this.fallbackUsers = null;
    this.isMongoDbAvailable = false;
    this.useMongoDb = shouldUseMongoDb();
    this.fallbackEnabled = isFallbackEnabled();
    
    // Cache for total count
    this._totalUsersCache = null;
    this._cacheTimestamp = 0;
    this._cacheDuration = 60000; // Cache for 1 minute
    
    // Log configuration
    logDatabaseConfig();
  }

  /**
   * Initialize the service
   */
  async initialize() {
    console.log('🔄 Initializing UserService...');
    
    if (this.useMongoDb) {
      try {
        await this.initializeMongoDb();
      } catch (error) {
        console.error('❌ MongoDB initialization failed:', error.message);
        if (this.fallbackEnabled) {
          console.log('🔄 Falling back to JSON file system...');
          await this.initializeFallback();
        } else {
          throw error;
        }
      }
    } else {
      await this.initializeFallback();
    }
    
    console.log(`✅ UserService initialized (${this.isMongoDbAvailable ? 'MongoDB' : 'JSON fallback'})`);
  }

  /**
   * Initialize MongoDB connection
   */
  async initializeMongoDb() {
    console.log('🔄 Connecting to MongoDB...');
    
    // Lazy load MongoDB client only when needed
    if (!MongoClient) {
      const mongodb = await import('mongodb');
      MongoClient = mongodb.MongoClient;
    }
    
    this.mongoClient = new MongoClient(getMongoDbUri(), getMongoDbOptions());
    await this.mongoClient.connect();
    
    // Test the connection
    await this.mongoClient.db('admin').command({ ping: 1 });
    
    this.mongoDb = this.mongoClient.db(getMongoDbDatabase());
    this.mongoCollection = this.mongoDb.collection(getMongoDbCollection());
    this.isMongoDbAvailable = true;
    
    console.log('✅ MongoDB connected successfully');
    
    // Create indexes for better performance
    await this.createIndexes();
  }

  /**
   * Initialize JSON fallback system
   */
  async initializeFallback() {
    console.log('🔄 Loading users from JSON file...');
    this.fallbackUsers = loadUsers();
    console.log(`✅ Loaded ${this.fallbackUsers.length} users from JSON`);
  }

  /**
   * Create MongoDB indexes for better performance
   */
  async createIndexes() {
    if (!this.isMongoDbAvailable) return;
    
    try {
      // Note: 'id' field is stored as string but represents numeric values
      await this.mongoCollection.createIndex({ id: 1 }, { unique: true });
      await this.mongoCollection.createIndex({ email: 1 }, { unique: true });
      await this.mongoCollection.createIndex({ name: 1 });
      await this.mongoCollection.createIndex({ role: 1 });
      
      // Check if index field exists and create index
      const sampleDoc = await this.mongoCollection.findOne({});
      if (sampleDoc && sampleDoc.index !== undefined) {
        await this.mongoCollection.createIndex({ index: 1 });
        console.log('✅ MongoDB indexes created (including index)');
      } else {
        console.log('✅ MongoDB indexes created');
        console.log('💡 Run scripts/add-numeric-id.js for better query performance');
      }
    } catch (error) {
      console.warn('⚠️ Index creation failed:', error.message);
    }
  }

  /**
   * Get total user count
   * @returns {Promise<number>} Total number of users
   */
  async getTotalUsers() {
    if (this.isMongoDbAvailable) {
      // Check if cache is valid
      const now = Date.now();
      if (this._totalUsersCache !== null && (now - this._cacheTimestamp) < this._cacheDuration) {
        return this._totalUsersCache;
      }
      
      // Update cache
      this._totalUsersCache = await this.mongoCollection.countDocuments();
      this._cacheTimestamp = now;
      return this._totalUsersCache;
    }
    return this.fallbackUsers ? this.fallbackUsers.length : 0;
  }
  
  /**
   * Invalidate the total users cache
   */
  invalidateTotalUsersCache() {
    this._totalUsersCache = null;
    this._cacheTimestamp = 0;
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<object|null>} User object or null if not found
   */
  async getUserById(id) {
    if (this.isMongoDbAvailable) {
      return await this.mongoCollection.findOne({ id: id.toString() });
    }
    
    if (this.fallbackUsers) {
      const index = id - 1; // Convert 1-based ID to 0-based index
      return (index >= 0 && index < this.fallbackUsers.length) ? this.fallbackUsers[index] : null;
    }
    
    return null;
  }

  /**
   * Get a batch of users
   * @param {number} startIndex - Starting index (0-based)
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Array of user objects
   */
  async getUserBatch(startIndex, limit) {
    if (this.isMongoDbAvailable) {
      // For high page numbers (skip > 10000), use keyset pagination for better performance
      if (startIndex > 10000) {
        return await this.getUserBatchOptimized(startIndex, limit);
      }
      
      // For low page numbers, regular skip is fine and simpler
      return await this.mongoCollection
        .find({})
        .sort({ index: 1 })
        .skip(startIndex)
        .limit(limit)
        .toArray();
    }
    
    if (this.fallbackUsers) {
      const endIndex = Math.min(startIndex + limit, this.fallbackUsers.length);
      return this.fallbackUsers.slice(startIndex, endIndex);
    }
    
    return [];
  }

  /**
   * Get a batch of users using optimized keyset pagination
   * @param {number} startIndex - Starting index (0-based)
   * @param {number} limit - Number of users to return
   * @returns {Promise<Array>} Array of user objects
   */
  async getUserBatchOptimized(startIndex, limit) {
    if (this.isMongoDbAvailable) {
      // For high page numbers, use keyset pagination instead of skip
      // This is much faster as it uses the index directly
      const startId = startIndex + 1; // Convert 0-based index to 1-based ID
      
      const startTime = Date.now();
      const result = await this.mongoCollection
        .find({ index: { $gte: startId } })
        .sort({ index: 1 })
        .limit(limit)
        .toArray();
      
      const duration = Date.now() - startTime;
      console.log(`⚡ Optimized query for startIndex=${startIndex}: ${duration}ms (using index >= ${startId})`);
      
      return result;
    }
    
    if (this.fallbackUsers) {
      const endIndex = Math.min(startIndex + limit, this.fallbackUsers.length);
      return this.fallbackUsers.slice(startIndex, endIndex);
    }
    
    return [];
  }

  /**
   * Search users
   * @param {string} searchTerm - Search term
   * @param {number} startIndex - Starting index
   * @param {number} limit - Number of results to return
   * @returns {Promise<object>} Search results with users and total count
   */
  async searchUsers(searchTerm, startIndex, limit) {
    if (this.isMongoDbAvailable) {
      return await this.mongoSearchUsers(searchTerm, startIndex, limit);
    }
    
    if (this.fallbackUsers) {
      return this.fallbackSearchUsers(searchTerm, startIndex, limit);
    }
    
    return { users: [], totalMatches: 0 };
  }

  /**
   * MongoDB search implementation
   */
  async mongoSearchUsers(searchTerm, startIndex, limit) {
    const lowercaseTerm = searchTerm.toLowerCase();
    const regex = new RegExp(lowercaseTerm, 'i');
    
    const searchQuery = {
      $or: [
        { name: regex },
        { email: regex },
        { role: regex }
      ]
    };
    
    // Get total count
    const totalMatches = await this.mongoCollection.countDocuments(searchQuery);
    
    // Use indexed index field for fast queries
    const users = await this.mongoCollection
      .find(searchQuery)
      .sort({ index: 1 })
      .skip(startIndex)
      .limit(limit)
      .toArray();
    
    return { users, totalMatches };
  }

  /**
   * Fallback search implementation (copied from existing logic)
   */
  fallbackSearchUsers(searchTerm, startIndex, limit) {
    const batchSize = 1000;
    const lowercaseTerm = searchTerm.toLowerCase();
    const matchingUsers = [];
    let totalMatches = 0;
    let foundEnough = false;
    
    // Process users in batches
    for (let batchStart = 0; batchStart < this.fallbackUsers.length && !foundEnough; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, this.fallbackUsers.length);
      const userBatch = this.fallbackUsers.slice(batchStart, batchEnd);
      
      for (const user of userBatch) {
        if (
          user.name.toLowerCase().includes(lowercaseTerm) ||
          user.email.toLowerCase().includes(lowercaseTerm) ||
          user.role.toLowerCase().includes(lowercaseTerm)
        ) {
          totalMatches++;
          
          if (totalMatches > startIndex && matchingUsers.length < limit) {
            matchingUsers.push(user);
          }
          
          if (matchingUsers.length >= limit && totalMatches >= 1000) {
            foundEnough = true;
            break;
          }
        }
      }
    }
    
    // Estimate total if we stopped early
    if (foundEnough) {
      const processedFraction = totalMatches / this.fallbackUsers.length;
      totalMatches = Math.round(totalMatches * (1 / processedFraction));
    }
    
    return { users: matchingUsers, totalMatches };
  }

  /**
   * Close database connections
   */
  async close() {
    if (this.mongoClient) {
      await this.mongoClient.close();
      console.log('✅ MongoDB connection closed');
    }
  }

  /**
   * Get service status
   * @returns {object} Service status information
   */
  getStatus() {
    return {
      useMongoDb: this.useMongoDb,
      isMongoDbAvailable: this.isMongoDbAvailable,
      fallbackEnabled: this.fallbackEnabled,
      fallbackUsersCount: this.fallbackUsers ? this.fallbackUsers.length : 0
    };
  }
}

// Create singleton instance
let userServiceInstance = null;

/**
 * Get UserService singleton instance
 * @returns {UserService} UserService instance
 */
export async function getUserService() {
  if (!userServiceInstance) {
    userServiceInstance = new UserService();
    await userServiceInstance.initialize();
  }
  return userServiceInstance;
}

/**
 * Close the UserService instance
 */
export async function closeUserService() {
  if (userServiceInstance) {
    await userServiceInstance.close();
    userServiceInstance = null;
  }
}

export default {
  UserService,
  getUserService,
  closeUserService
}; 