// server/data/mongodb-operations.js

import { getUserService } from './user-service.js';
import { loadUsers, generateUser } from './users.js';

/**
 * MongoDB Operations - CRUD operations and seeding functionality
 */
export class MongoDbOperations {
  constructor(userService) {
    this.userService = userService;
  }

  /**
   * Check if MongoDB is available
   * @returns {boolean} True if MongoDB is available
   */
  isMongoDbAvailable() {
    return this.userService.isMongoDbAvailable;
  }

  /**
   * Seed MongoDB with generated users
   * @param {number} userCount - Number of users to generate (default: 1000000)
   * @param {number} batchSize - Batch size for insertion (default: 1000)
   * @returns {Promise<object>} Result object with statistics
   */
  async seedFromGeneratedUsers(userCount = 1000000, batchSize = 1000) {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    console.log(`🌱 Starting MongoDB seeding with ${userCount} users...`);
    const startTime = Date.now();
    
    // Clear existing data
    await this.clearAllUsers();
    
    let insertedCount = 0;
    let errorCount = 0;
    
    try {
      // Generate and insert users in batches
      for (let i = 0; i < userCount; i += batchSize) {
        const batch = [];
        const endIndex = Math.min(i + batchSize, userCount);
        
        // Generate users for this batch
        for (let j = i; j < endIndex; j++) {
          batch.push(generateUser(j + 1)); // IDs start from 1
        }
        
        // Insert batch
        try {
          const result = await this.userService.mongoCollection.insertMany(batch, { ordered: false });
          insertedCount += result.insertedCount;
          
          // Log progress every 50k users
          if ((i + batchSize) % 50000 === 0 || endIndex === userCount) {
            console.log(`📊 Inserted ${Math.min(i + batchSize, userCount)} users...`);
          }
        } catch (error) {
          console.error(`❌ Error inserting batch starting at ${i}:`, error.message);
          errorCount++;
        }
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ MongoDB seeding completed!`);
      console.log(`📊 Statistics:`);
      console.log(`  - Total users: ${userCount}`);
      console.log(`  - Inserted: ${insertedCount}`);
      console.log(`  - Errors: ${errorCount}`);
      console.log(`  - Duration: ${duration}ms`);
      console.log(`  - Users/second: ${Math.round(insertedCount / (duration / 1000))}`);
      
      return {
        success: true,
        userCount,
        insertedCount,
        errorCount,
        duration,
        usersPerSecond: Math.round(insertedCount / (duration / 1000))
      };
      
    } catch (error) {
      console.error('❌ MongoDB seeding failed:', error);
      return {
        success: false,
        error: error.message,
        insertedCount,
        errorCount
      };
    }
  }

  /**
   * Seed MongoDB from existing JSON file
   * @param {number} batchSize - Batch size for insertion (default: 1000)
   * @returns {Promise<object>} Result object with statistics
   */
  async seedFromJsonFile(batchSize = 1000) {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    console.log('🌱 Starting MongoDB seeding from JSON file...');
    const startTime = Date.now();
    
    // Load users from JSON file
    const users = loadUsers();
    console.log(`📂 Loaded ${users.length} users from JSON file`);
    
    // Clear existing data
    await this.clearAllUsers();
    
    let insertedCount = 0;
    let errorCount = 0;
    
    try {
      // Insert users in batches
      for (let i = 0; i < users.length; i += batchSize) {
        const batch = users.slice(i, i + batchSize);
        
        try {
          const result = await this.userService.mongoCollection.insertMany(batch, { ordered: false });
          insertedCount += result.insertedCount;
          
          // Log progress every 50k users
          if ((i + batchSize) % 50000 === 0 || i + batchSize >= users.length) {
            console.log(`📊 Inserted ${Math.min(i + batchSize, users.length)} users...`);
          }
        } catch (error) {
          console.error(`❌ Error inserting batch starting at ${i}:`, error.message);
          errorCount++;
        }
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`✅ MongoDB seeding from JSON completed!`);
      console.log(`📊 Statistics:`);
      console.log(`  - Source users: ${users.length}`);
      console.log(`  - Inserted: ${insertedCount}`);
      console.log(`  - Errors: ${errorCount}`);
      console.log(`  - Duration: ${duration}ms`);
      console.log(`  - Users/second: ${Math.round(insertedCount / (duration / 1000))}`);
      
      return {
        success: true,
        sourceUserCount: users.length,
        insertedCount,
        errorCount,
        duration,
        usersPerSecond: Math.round(insertedCount / (duration / 1000))
      };
      
    } catch (error) {
      console.error('❌ MongoDB seeding from JSON failed:', error);
      return {
        success: false,
        error: error.message,
        insertedCount,
        errorCount
      };
    }
  }

  /**
   * Clear all users from MongoDB
   * @returns {Promise<object>} Result object
   */
  async clearAllUsers() {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    console.log('🗑️ Clearing all users from MongoDB...');
    const result = await this.userService.mongoCollection.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users`);
    
    return {
      success: true,
      deletedCount: result.deletedCount
    };
  }

  /**
   * Get MongoDB collection statistics
   * @returns {Promise<object>} Statistics object
   */
  async getCollectionStats() {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    const stats = await this.userService.mongoDb.command({ 
      collStats: this.userService.mongoCollection.collectionName 
    });
    
    const userCount = await this.userService.mongoCollection.countDocuments();
    const indexes = await this.userService.mongoCollection.indexes();
    
    return {
      userCount,
      storageSize: stats.storageSize,
      indexSize: stats.totalIndexSize,
      indexes: indexes.length,
      indexNames: indexes.map(idx => idx.name)
    };
  }

  /**
   * Create a new user
   * @param {object} userData - User data
   * @returns {Promise<object>} Created user
   */
  async createUser(userData) {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    // Generate next ID
    const lastUser = await this.userService.mongoCollection
      .findOne({}, { sort: { id: -1 } });
    
    const nextId = lastUser ? parseInt(lastUser.id) + 1 : 1;
    
    const user = {
      id: nextId.toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar || userData.name.charAt(0).toUpperCase(),
      ...(userData.phone && { phone: userData.phone })
    };
    
    const result = await this.userService.mongoCollection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Updated user
   */
  async updateUser(id, userData) {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    const updateData = { ...userData };
    delete updateData.id; // Don't allow ID updates
    
    const result = await this.userService.mongoCollection.updateOne(
      { id: id.toString() },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }
    
    return await this.userService.mongoCollection.findOne({ id: id.toString() });
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} True if deleted
   */
  async deleteUser(id) {
    if (!this.isMongoDbAvailable()) {
      throw new Error('MongoDB is not available');
    }

    const result = await this.userService.mongoCollection.deleteOne({ id: id.toString() });
    return result.deletedCount > 0;
  }

  /**
   * Check if MongoDB is seeded (has users)
   * @returns {Promise<boolean>} True if seeded
   */
  async isSeeded() {
    if (!this.isMongoDbAvailable()) {
      return false;
    }

    const userCount = await this.userService.mongoCollection.countDocuments();
    return userCount > 0;
  }
}

/**
 * Get MongoDB operations instance
 * @returns {Promise<MongoDbOperations>} MongoDB operations instance
 */
export async function getMongoDbOperations() {
  const userService = await getUserService();
  return new MongoDbOperations(userService);
}

export default {
  MongoDbOperations,
  getMongoDbOperations
}; 