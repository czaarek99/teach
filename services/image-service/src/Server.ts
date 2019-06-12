import * as Koa from "koa";
import { config } from "./config";
import { Logger, RedisClient } from "server-lib";

export class Server {

	private readonly logger = new Logger("global-logger");

	public startServer() : void {
		const app = new Koa();

		this.logger.info("Starting server", {
			port: config.serverPort
		});

		app.listen(config.serverPort);
	}

}