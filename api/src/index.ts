import { Server } from "./Server"

async function start() {
	const server = new Server();

	await server.startDatabase();
	server.startServer();
}

start();
