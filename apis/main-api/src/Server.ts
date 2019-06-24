import * as Koa from "koa";
import * as bodyParser from "koa-body";
import * as Router from "koa-router";
import * as userAgent from "koa-useragent";
import * as cors from "@koa/cors";
import * as mount from "koa-mount";
import * as serve from "koa-static";

import auth from "./routes/auth";
import ad from "./routes/ad";
import image from "./routes/image";
import user from "./routes/user";

import { config } from "./config";
import { EmailClient } from "./email/EmailClient";
import { connectToDatabase } from "./database/connection";

import {
	Logger,
	RedisClient,
	requestIdMiddleware,
	getSessionMiddleware,
	authenticationMiddleware,
	loggerMiddleware,
	IApiState,
	getErrorHandler,
	ApiContext
} from "server-lib";

interface IState extends IApiState {
	emailClient: EmailClient
	redisClient: RedisClient
}

export type CustomContext = ApiContext<IState>;

export class Server {

	private readonly globalLogger = new Logger("api-global");
	private readonly emailClient = new EmailClient(this.globalLogger);
	private readonly redisClient = new RedisClient({
		password: config.redisPassword,
		port: config.redisPort,
		db: config.redisDatabase,
		host: config.redisHost
	});

	private attachState = async (context: CustomContext, next: Function) : Promise<void> => {
		context.state.emailClient = this.emailClient;
		context.state.redisClient = this.redisClient;

		await next();
	}

	private async startDatabase() : Promise<void> {
		const connection = connectToDatabase();

		if(config.isDevelopment) {
			await connection.sync({
				force: config.forceDropDatabse
			});
		}

	}

	public async startServer() : Promise<void> {
		await this.startDatabase();

		const app = new Koa();
		app.keys = config.applicationKeys;

		app.use(cors({
			credentials: true
		}));

		app.use(bodyParser({
			multipart: true
		}));

		app.use(userAgent);
		app.use(requestIdMiddleware);
		app.use(getErrorHandler(this.globalLogger));
		app.use(loggerMiddleware);
		app.use(getSessionMiddleware(this.redisClient));
		app.use(this.attachState);

		const openRouter = new Router();
		openRouter.use("/auth", auth.middleware());
		openRouter.use("/ad", ad.middleware());
		openRouter.use("/user", user.middleware());
		openRouter.use("/image", image.routes());
		app.use(openRouter.routes());

		const protectedRouter = new Router();
		protectedRouter.use(authenticationMiddleware);
		app.use(protectedRouter.routes());

		app.use(mount("/images", serve(config.staticImagesPath)))
		app.use(mount("/images", serve(config.userImagesPath)))

		this.globalLogger.info("Starting server", {
			config
		});

		app.listen(config.serverPort);
	}

}
