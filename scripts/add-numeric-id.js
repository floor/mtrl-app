#!/usr/bin/env node

// Script to add numericId field to all MongoDB documents
import { getUserService } from '../server/data/user-service.js';

async function addNumericIds() {
  console.log('🔧 Adding numeric IDs to MongoDB documents...');
  
  try {
    const userService = await getUserService();
    
    if (!userService.isMongoDbAvailable) {
      console.error('❌ MongoDB is not available');
      process.exit(1);
    }
    
    const collection = userService.mongoCollection;
    
    // Count documents without numericId
    const count = await collection.countDocuments({ numericId: { $exists: false } });
    console.log(`📊 Documents to update: ${count.toLocaleString()}`);
    
    if (count === 0) {
      console.log('✅ All documents already have numericId');
      await userService.close();
      process.exit(0);
    }
    
    const startTime = Date.now();
    let updated = 0;
    const batchSize = 10000;
    
    // Process in batches
    while (updated < count) {
      const batch = await collection
        .find({ numericId: { $exists: false } })
        .limit(batchSize)
        .toArray();
      
      if (batch.length === 0) break;
      
      // Prepare bulk operations
      const bulkOps = batch.map(doc => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { numericId: parseInt(doc.id) } }
        }
      }));
      
      // Execute bulk update
      const result = await collection.bulkWrite(bulkOps);
      updated += result.modifiedCount;
      
      console.log(`📊 Updated ${updated.toLocaleString()} / ${count.toLocaleString()} documents...`);
    }
    
    const duration = Date.now() - startTime;
    console.log(`\n✅ Completed! Updated ${updated.toLocaleString()} documents in ${(duration / 1000).toFixed(1)} seconds`);
    
    // Create index on numericId
    console.log('📇 Creating index on numericId...');
    await collection.createIndex({ numericId: 1 });
    console.log('✅ Index created successfully');
    
    await userService.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addNumericIds(); 