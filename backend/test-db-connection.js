const { Client } = require('pg');

async function testConnection() {
  console.log('🔍 Testing database connections...\n');

  // Test System Database
  console.log('📊 Testing System Database (localhost:5432)...');
  const systemClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'cargo_db',
  });

  try {
    await systemClient.connect();
    const result = await systemClient.query('SELECT version()');
    console.log('✅ System Database: Connected successfully');
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    await systemClient.end();
  } catch (error) {
    console.log('❌ System Database: Connection failed');
    console.log(`   Error: ${error.message}`);
  }

  console.log('');

  // Test Auth Database
  console.log('🔐 Testing Auth Database (localhost:5434)...');
  const authClient = new Client({
    host: 'localhost',
    port: 5434,
    user: 'postgres',
    password: 'postgres',
    database: 'auth_db',
  });

  try {
    await authClient.connect();
    const result = await authClient.query('SELECT version()');
    console.log('✅ Auth Database: Connected successfully');
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    await authClient.end();
  } catch (error) {
    console.log('❌ Auth Database: Connection failed');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🎯 Database connection test completed!');
}

testConnection().catch(console.error); 