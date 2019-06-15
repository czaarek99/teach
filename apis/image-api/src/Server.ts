import * as Koa from "koa";
import * as bodyParser from "koa-body";
import * as serve from "koa-static";
import * as cors from "@koa/cors";

import { config } from "./config";
import { Logger, RedisClient, IApiState, requestIdMiddleware, loggerMiddleware, getSessionMiddleware, authenticationMiddleware, getErrorHandler } from "server-lib";
import { connectToDatabase } from "./database/connection";
import { router } from "./router";

export interface IRedisSession {
	userId: number
	expirationDate: number
}

interface IState extends IApiState {
	redisClient: RedisClient
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

		app.use(cors());

		app.use(bodyParser({
			multipart: true
		}))

		app.use(requestIdMiddleware);
		app.use(getErrorHandler(this.logger));
		app.use(loggerMiddleware);
		app.use(getSessionMiddleware(this.redisClient));

		app.use(async (context: CustomContext, next: Function) => {
			context.state.redisClient = this.redisClient;

			await next();
		});

		app.use(serve(config.staticImagesPath));
		app.use(serve(config.userImagesPath));

		this.logger.info("Starting server", {
			port: config.serverPort
		});

		app.use(authenticationMiddleware);

		app.use(router.middleware());

		app.listen(config.serverPort);
	}

}
