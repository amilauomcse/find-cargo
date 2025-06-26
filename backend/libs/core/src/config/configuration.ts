export default () => ({
  APP_ENV: process.env.APP_ENV || "development",
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 3000,

  // System database configuration
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "cargo_db",
    logging: process.env.DB_LOG_ENABLE === "true" || true,
  },

  // Auth database configuration
  authDatabase: {
    host: process.env.AUTH_DB_HOST || "localhost",
    port: parseInt(process.env.AUTH_DB_PORT, 10) || 5434,
    username: process.env.AUTH_DB_USERNAME || "postgres",
    password: process.env.AUTH_DB_PASSWORD || "postgres",
    database: process.env.AUTH_DB_NAME || "auth_db",
    logging: process.env.AUTH_DB_LOG_ENABLE === "true" || true,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshTokenExpireTimeout: process.env.REFRESH_TOKEN_EXPIRE_TIMEOUT || "7d",
  },

  // Frontend URL for CORS
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // Root user configuration
  rootUser: {
    email: process.env.ROOT_USER_EMAIL || "root",
    password: process.env.ROOT_USER_PASSWORD || "123",
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || "debug",
});
