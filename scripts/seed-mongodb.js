#!/usr/bin/env node

// Script to seed MongoDB with users
import { getMongoDbOperations } from '../server/data/mongodb-operations.js';

async function seedDatabase() {
  console.log('🌱 Starting MongoDB seeding process (append mode)...');
  
  try {
    // Get MongoDB operations instance
    const mongoOps = await getMongoDbOperations();
    
    // Check if MongoDB is available
    if (!mongoOps.isMongoDbAvailable()) {
      console.error('❌ MongoDB is not available. Please ensure MongoDB is running.');
      process.exit(1);
    }
    
    // Check current user count
    const stats = await mongoOps.getCollectionStats();
    const currentCount = stats.userCount;
    console.log(`📊 Current users in MongoDB: ${currentCount.toLocaleString()}`);
    
    // Find the highest ID in the database
    const lastUser = await mongoOps.userService.mongoCollection
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const lastId = lastUser.length > 0 ? parseInt(lastUser[0].id) : 0;
    console.log(`📊 Highest user ID: ${lastId}`);
    
    const targetTotal = 1000000;
    const usersToAdd = targetTotal - currentCount;
    
    if (currentCount >= targetTotal) {
      console.log(`✅ Database already contains ${currentCount.toLocaleString()} users (target: ${targetTotal.toLocaleString()})`);
      process.exit(0);
    }
    
    console.log(`📈 Will add ${usersToAdd.toLocaleString()} users to reach ${targetTotal.toLocaleString()} total`);
    
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise((resolve) => {
      rl.question('Continue? (y/N): ', resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Seeding cancelled.');
      process.exit(0);
    }
    
    // Import generateUser function
    const { generateUser } = await import('../server/data/users.js');
    
    // Add users starting from lastId + 1
    console.log(`🚀 Adding ${usersToAdd.toLocaleString()} users starting from ID ${lastId + 1}...`);
    const startTime = Date.now();
    
    const batchSize = 5000;
    let insertedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < usersToAdd; i += batchSize) {
      const batch = [];
      const endIndex = Math.min(i + batchSize, usersToAdd);
      
      // Generate users for this batch
      for (let j = i; j < endIndex; j++) {
        const userId = lastId + j + 1; // Start from lastId + 1
        batch.push(generateUser(userId));
      }
      
      // Insert batch
      try {
        const result = await mongoOps.userService.mongoCollection.insertMany(batch, { ordered: false });
        insertedCount += result.insertedCount;
        
        // Log progress every 50k users
        if ((i + batchSize) % 50000 === 0 || endIndex === usersToAdd) {
          console.log(`📊 Added ${Math.min(i + batchSize, usersToAdd).toLocaleString()} users...`);
        }
      } catch (error) {
        console.error(`❌ Error inserting batch starting at ${i}:`, error.message);
        errorCount++;
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n✅ Seeding completed successfully!');
    console.log(`📊 Final statistics:`);
    console.log(`  - Users added: ${insertedCount.toLocaleString()}`);
    console.log(`  - Errors: ${errorCount}`);
    console.log(`  - Duration: ${(duration / 1000).toFixed(1)} seconds`);
    console.log(`  - Speed: ${Math.round(insertedCount / (duration / 1000)).toLocaleString()} users/second`);
    
    // Verify final count
    const finalStats = await mongoOps.getCollectionStats();
    console.log(`\n✅ Total users in database: ${finalStats.userCount.toLocaleString()}`);
    
    // Close connections
    await mongoOps.userService.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase(); 