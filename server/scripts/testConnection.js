require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error('\n❌ Error: MONGODB_URI is not defined in environment variables');
    console.log('\n💡 Make sure:');
    console.log('1. Your .env file exists');
    console.log('2. It contains MONGODB_URI=your_connection_string');
    console.log('3. The .env file is in the correct location');
    console.log('\nCurrent .env path:', require('path').resolve('../.env'));
    return;
  }

  try {
    console.log('\n🔄 Attempting to connect to MongoDB...\n');

    const startTime = Date.now();
    await mongoose.connect(uri, {
      serverApi: {
        version: '1',
        strict: false,
        deprecationErrors: true,
      }
    });

    // Connection successful - gather information
    const connectionTime = Date.now() - startTime;
    const db = mongoose.connection.db;
    
    console.log('✅ Connection successful!');
    console.log('⏱️  Connection established in:', connectionTime, 'ms');
    console.log('\n📊 Database Information:');
    console.log('- Database Name:', db.databaseName);
    console.log('- Connection Host:', mongoose.connection.host);
    console.log('- MongoDB Version:', await db.command({ buildInfo: 1 }).then(info => info.version));

    // Get collection statistics
    console.log('\n📑 Collections:');
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      const stats = await db.command({ collStats: collection.name });
      console.log(`- ${collection.name}:`);
      console.log(`  • Documents: ${stats.count}`);
      console.log(`  • Size: ${(stats.size / 1024).toFixed(2)} KB`);
    }

    // Test write permissions
    console.log('\n🔒 Testing Permissions:');
    try {
      const testCollection = 'connection_test';
      await db.collection(testCollection).insertOne({ test: true, timestamp: new Date() });
      await db.collection(testCollection).deleteOne({ test: true });
      console.log('✅ Write permissions verified');
    } catch (error) {
      console.log('❌ Write permissions test failed:', error.message);
    }

    // Test connection speed
    console.log('\n🚀 Testing Connection Speed:');
    const pingStart = Date.now();
    await db.command({ ping: 1 });
    console.log('Ping Time:', Date.now() - pingStart, 'ms');

  } catch (error) {
    console.error('\n❌ Connection Error:', error);
    console.error('\nError Details:');
    console.error('- Name:', error.name);
    console.error('- Message:', error.message);
    if (error.code) console.error('- Code:', error.code);
    if (error.stack) console.error('- Stack:', error.stack);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n👋 Disconnected from MongoDB');
    }
  }
}

// Add event listeners for connection states
mongoose.connection.on('connecting', () => {
  console.log('⏳ Connecting to MongoDB...');
});

mongoose.connection.on('disconnecting', () => {
  console.log('⏳ Disconnecting from MongoDB...');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB Error:', err);
});

run().catch(console.error);
