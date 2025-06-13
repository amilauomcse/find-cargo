export default () => ({
	APP_ENV: process.env.APP_ENV || 'dev',
	backendHost: process.env.BACKEND_HOST || 'http://localhost:3000',
	database: {
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT, 10) || 5432,
		username: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		database: process.env.DB_NAME || 'cargo_db',
		logging: process.env.DB_LOG_ENABLE || true,
	},
	apiJwt: {
		secret: process.env.API_JWT_SECRET || 'api_jwt_secret',
		expireTimeout: process.env.API_JWT_EXPIRE || '7200s',
		refreshTokenSecret:
			process.env.API_REFRESH_TOKEN_SECRET || 'api_refresh_token_secret',
		refreshTokenExpireTimeout:
			process.env.API_REFRESH_TOKEN_EXPIRE || '7200s',
	},
	security: {
		pwdSecret: process.env.PASSWORD_SECRET,
		salt: process.env.PASSWORD_SALT,
	},
	token: {
		forgotPwdExpireTimeOut:
			Number(process.env.FORGOT_PWD_TOKEN_EXPIRE) || 3600, // In Seconds
		length: process.env.TOKEN_LENGTH || 8,
		verificationSecret: process.env.TOKEN_VERIFICATION_SECRET,
	},
});
