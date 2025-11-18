require('dotenv').config({ path: '.env.local' });

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('Error: MONGODB_URI not found in environment variables');
    console.error('Make sure .env.local exists in the root directory');
    process.exit(1);
  }

  console.log('✓ MongoDB URI loaded\n');

  rl.question('Enter admin email: ', (email) => {
    rl.question('Enter admin password: ', (password) => {
      rl.question('Enter admin name: ', (name) => {
        rl.question('Enter company name (default: Join2Campus): ', async (company) => {
          
          try {
            console.log('\nConnecting to MongoDB...');
            const client = await MongoClient.connect(uri);
            const db = client.db();
            console.log('✓ Connected to MongoDB\n');
            
            // Check if admin already exists
            const existingAdmin = await db.collection('agents').findOne({ email });
            if (existingAdmin) {
              console.log('❌ Admin with this email already exists!');
              await client.close();
              rl.close();
              return;
            }
            
            // Hash password
            console.log('Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create admin
            console.log('Creating admin account...');
            await db.collection('agents').insertOne({
              email,
              password: hashedPassword,
              name,
              role: 'admin',
              company: company || 'Join2Campus',
              country: 'India',
              phone: '',
              status: 'active',
              createdAt: new Date(),
              totalApplications: 0,
              acceptedApplications: 0,
            });
            
            console.log('\n✅ Admin account created successfully!');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('Email:', email);
            console.log('Name:', name);
            console.log('Role: admin');
            console.log('Company:', company || 'Join2Campus');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('\nYou can now login at: http://localhost:3000/login');
            
            await client.close();
            rl.close();
          } catch (error) {
            console.error('\n❌ Error:', error.message);
            rl.close();
          }
        });
      });
    });
  });
}

createAdmin();
