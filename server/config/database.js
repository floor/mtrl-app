// server/config/database.js

/**
 * Database configuration based on environment variables
 */
export const DATABASE_CONFIG = {
  // Primary data source: 'mongodb' or 'json'
  type: process.env.DB_TYPE || 'json',
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    database: process.env.MONGODB_DATABASE || 'mtrl',
    collection: process.env.MONGODB_COLLECTION || 'users',
    // Connection options
    options: {
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT) || 5000,
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
    }
  },
  
  // Fallback configuration
  fallback: {
    enabled: process.env.DB_FALLBACK !== 'false', // Default to true
    generateUsers: process.env.GENERATE_USERS !== 'false', // Default to true
    userCount: parseInt(process.env.FALLBACK_USER_COUNT) || 1000000
  },
  
  // Performance settings
  performance: {
    batchSize: parseInt(process.env.DB_BATCH_SIZE) || 1000,
    cacheEnabled: process.env.DB_CACHE !== 'false', // Default to true
    cacheTTL: parseInt(process.env.DB_CACHE_TTL) || 300000 // 5 minutes
  },
  
  // Logging configuration
  logging: {
    enabled: process.env.DB_LOGGING !== 'false', // Default to true
    level: process.env.DB_LOG_LEVEL || 'info' // info, warn, error
  }
};

/**
 * Get the effective database type based on configuration and availability
 * @returns {string} The database type to use
 */
export function getEffectiveDbType() {
  // If explicitly set to mongodb, try to use it
  if (DATABASE_CONFIG.type === 'mongodb') {
    return 'mongodb';
  }
  
  // Default to json
  return 'json';
}

/**
 * Check if MongoDB should be used
 * @returns {boolean} True if MongoDB should be used
 */
export function shouldUseMongoDb() {
  return DATABASE_CONFIG.type === 'mongodb' && DATABASE_CONFIG.mongodb.uri;
}

/**
 * Check if fallback is enabled
 * @returns {boolean} True if fallback is enabled
 */
export function isFallbackEnabled() {
  return DATABASE_CONFIG.fallback.enabled;
}

/**
 * Get MongoDB connection string
 * @returns {string} MongoDB connection string
 */
export function getMongoDbUri() {
  return DATABASE_CONFIG.mongodb.uri;
}

/**
 * Get MongoDB database name
 * @returns {string} Database name
 */
export function getMongoDbDatabase() {
  return DATABASE_CONFIG.mongodb.database;
}

/**
 * Get MongoDB collection name
 * @returns {string} Collection name
 */
export function getMongoDbCollection() {
  return DATABASE_CONFIG.mongodb.collection;
}

/**
 * Get MongoDB connection options
 * @returns {object} Connection options
 */
export function getMongoDbOptions() {
  return DATABASE_CONFIG.mongodb.options;
}

/**
 * Log database configuration (without sensitive info)
 */
export function logDatabaseConfig() {
  if (DATABASE_CONFIG.logging.enabled) {
    console.log('📊 Database Configuration:');
    console.log(`  Type: ${DATABASE_CONFIG.type}`);
    console.log(`  MongoDB URI: ${DATABASE_CONFIG.mongodb.uri.replace(/\/\/.*@/, '//*****@')}`);
    console.log(`  Database: ${DATABASE_CONFIG.mongodb.database}`);
    console.log(`  Collection: ${DATABASE_CONFIG.mongodb.collection}`);
    console.log(`  Fallback: ${DATABASE_CONFIG.fallback.enabled ? 'Enabled' : 'Disabled'}`);
    console.log(`  User Count: ${DATABASE_CONFIG.fallback.userCount}`);
  }
}

export default DATABASE_CONFIG; 