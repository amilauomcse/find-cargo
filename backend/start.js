const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Cargo Backend...\n');

// Step 1: Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Application Configuration
APP_ENV=development
NODE_ENV=development
PORT=3000

# System Database Configuration (Docker containers)
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=cargo_db
DB_LOG_ENABLE=true

# Auth Database Configuration (Docker containers)
AUTH_DB_HOST=localhost
AUTH_DB_PORT=5434
AUTH_DB_USERNAME=postgres
AUTH_DB_PASSWORD=postgres
AUTH_DB_NAME=auth_db
AUTH_DB_LOG_ENABLE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRE_TIMEOUT=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Root User Configuration
ROOT_USER_EMAIL=root@email.com
ROOT_USER_PASSWORD=123

# Logging
LOG_LEVEL=debug
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else {
  console.log('ℹ️  .env file already exists');
}

// Step 2: Start Docker databases
console.log('\n🐳 Starting Docker databases...');
try {
  execSync('docker-compose up -d db auth_db', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..') // Go to root directory
  });
  console.log('✅ Docker databases started');
} catch (error) {
  console.log('❌ Failed to start Docker databases:', error.message);
  console.log('💡 Make sure Docker is running and you\'re in the correct directory');
  process.exit(1);
}

// Step 3: Wait for databases to be ready
console.log('\n⏳ Waiting for databases to be ready...');
console.log('⏰ This may take up to 30 seconds...');

// Function to check if databases are ready
const checkDatabases = () => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds
    
    const check = () => {
      attempts++;
      console.log(`🔍 Checking databases (attempt ${attempts}/${maxAttempts})...`);
      
      try {
        // Check system database
        execSync('docker exec postgres_db pg_isready -U postgres -d cargo_db', { 
          stdio: 'pipe',
          timeout: 5000
        });
        
        // Check auth database
        execSync('docker exec auth_postgres_db pg_isready -U postgres -d auth_db', { 
          stdio: 'pipe',
          timeout: 5000
        });
        
        console.log('✅ Databases are ready!');
        resolve();
      } catch (error) {
        if (attempts >= maxAttempts) {
          console.log('❌ Databases failed to start within 30 seconds');
          console.log('💡 You can try running the backend manually with: yarn start:dev');
          process.exit(1);
        }
        
        setTimeout(check, 1000); // Wait 1 second before next attempt
      }
    };
    
    check();
  });
};

// Wait for databases to be ready
checkDatabases().then(() => {
  // Step 4: Install dependencies if needed
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('\n📦 Installing dependencies...');
    try {
      execSync('yarn install', { stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.log('❌ Failed to install dependencies:', error.message);
      process.exit(1);
    }
  }

  // Step 5: Start the backend
  console.log('\n🚀 Starting backend server...');
  console.log('📋 Backend will be available at: http://localhost:3000');
  console.log('📋 Root user: root@email.com / 123');
  console.log('📋 Press Ctrl+C to stop\n');
  
  try {
    execSync('yarn start:dev', { stdio: 'inherit' });
  } catch (error) {
    console.log('\n❌ Backend stopped');
  }
}); 