import * as Koa from "koa";
import * as bodyParser from "koa-body";
import * as serve from "koa-static";

import { config } from "./config";
import { Logger, RedisClient } from "server-lib";
import { connectToDatabase } from "./database/connection";

interface IRedisSession {
	
}

interface IState {
	redisClient: RedisClient
	userId: number
}

export type CustomContext = Koa.ParameterizedContext<IState>

export class Server {

	private readonly logger = new Logger("global-logger");
	private readonly redisClient = new RedisClient({
		db: config.redisDatabase,
		password: config.redisPassword,
		host: config.redisHost,
		port: config.redisPort
	});

	public async startServer() : Promise<void> {
		await connectToDatabase();

		const app = new Koa();

		app.use(bodyParser({
			multipart: true
		}))

		app.use(async (context: CustomContext, next: Function) => {
			context.state.redisClient = this.redisClient;

			await next();
		});

		app.use(async (context: CustomContext, next: Function) => {
			this.redisClient.getJSON
		});

		app.use(serve(config.staticImagesPath));
		app.use(serve(config.userImagesPath));

		this.logger.info("Starting server", {
			port: config.serverPort
		});

		app.listen(config.serverPort);
	}

}
