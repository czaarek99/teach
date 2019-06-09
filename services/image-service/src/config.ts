export const config = {
	serverPort: process.env.SERVER_PORT,
	isDevelopment: process.env.NODE_ENV === "development",
	isProduction: process.env.NODE_ENV === "production"
}