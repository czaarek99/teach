export const config = {
	serverPort: process.env.SERVER_PORT,

	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",

	databaseName: process.env.DATABASE_NAME,
	databaseUser: process.env.DATABASE_USER,
	databasePassword: process.env.DATABASE_PASSWORD,
	databaseHost: process.env.DATABASE_HOST,
	databasePort: parseInt(process.env.DATABASE_PORT),
	forceDropDatabse: process.env.FORCE_DROP_DATABASE === "true",

	redisHost: process.env.REDIS_HOST,
	redisPort: parseInt(process.env.REDIS_PORT),
	redisPassword: process.env.REDIS_PASSWORD,
	redisDatabase: parseInt(process.env.REDIS_DATABASE),
}