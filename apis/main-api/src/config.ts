export const config = {
	databaseName: process.env.DATABASE_NAME,
	databaseUser: process.env.DATABASE_USER,
	databasePassword: process.env.DATABASE_PASSWORD,
	databaseHost: process.env.DATABASE_HOST,
	databasePort: parseInt(process.env.DATABASE_PORT),
	forceDropDatabse: process.env.FORCE_DROP_DATABASE === "true",

	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production",

	sesKey: process.env.SES_KEY,
	sesSecret: process.env.SES_SECRET,

	staticImagesPath: process.env.STATIC_IMAGES_PATH,
	userImagesPath: process.env.USER_IMAGES_PATH,

	redisHost: process.env.REDIS_HOST,
	redisPort: parseInt(process.env.REDIS_PORT),
	redisPassword: process.env.REDIS_PASSWORD,
	redisDatabase: parseInt(process.env.REDIS_DATABASE),

	recaptchaSecret: process.env.RECAPTCHA_SECRET,
	serverPort: parseInt(process.env.SERVER_PORT),
	applicationKeys: process.env.APPLICATION_KEYS.split(","),
}