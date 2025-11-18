require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');

async function removeTestUsers() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('Error: MONGODB_URI not found');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(uri);
    const db = client.db();
    console.log('✓ Connected\n');

    // Remove test users
    const result = await db.collection('agents').deleteMany({
      email: { $in: ['agent@example.com', 'admin@example.com'] }
    });

    console.log(`✅ Removed ${result.deletedCount} test users`);
    
    // Show remaining users
    const remaining = await db.collection('agents').find({}).toArray();
    console.log(`\nRemaining users: ${remaining.length}`);
    remaining.forEach(u => console.log(`  - ${u.email} (${u.role})`));

    await client.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

removeTestUsers();
