import { Server } from "./Server";

async function start() {
	const server = new Server();
	await server.startServer();
}

start();
