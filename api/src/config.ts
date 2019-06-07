export const config = {
	databaseName: process.env.DATABASE_NAME,
	databaseUser: process.env.DATABASE_USER,
	databasePassword: process.env.DATABASE_PASSWORD,
	databaseHost: process.env.DATABASE_HOST,
	serverPort: parseInt(process.env.SERVER_PORT),
	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",
	applicationKeys: process.env.APPLICATION_KEYS.split(",")
}