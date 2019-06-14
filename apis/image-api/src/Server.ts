import * as Koa from "koa";
import * as bodyParser from "koa-body";
import * as serve from "koa-static";

import { config } from "./config";
import { Logger, RedisClient } from "server-lib";
import { connectToDatabase } from "./database/connection";
import { router } from "./router";
import { SESSION_COOKIE_NAME } from "common-library";
import { isBefore } from "date-fns";

export interface IRedisSession {
	userId: number
	expirationDate: number
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

		app.use(serve(config.staticImagesPath));
		app.use(serve(config.userImagesPath));

		this.logger.info("Starting server", {
			port: config.serverPort
		});

		app.use((async (context: CustomContext, next: Function) => {
			const sessionId = context.cookies.get(SESSION_COOKIE_NAME)

			if(!sessionId) {
				context.status = 401;
				return;
			}

			const session = await this.redisClient.getJSON<IRedisSession>(sessionId);

			if(!session) {
				context.status = 401;
				return;
			}

			const now = new Date();
			const expirationDate = new Date(session.expirationDate);

			if(isBefore(expirationDate, now)) {
				context.status = 401;
				return;
			}

			context.state.userId = session.userId;

			await next();
		}));

		app.use(router.middleware());

		app.listen(config.serverPort);
	}

}
