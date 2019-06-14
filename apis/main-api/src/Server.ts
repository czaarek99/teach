import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as userAgent from "koa-useragent";

import auth from "./routes/auth";

import { config } from "./config";
import { HttpError, ErrorMessage } from "common-library";
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
	throwApiError
} from "server-lib";

interface IState extends IApiState {
	emailClient: EmailClient
	redisClient: RedisClient
}

export type CustomContext = Koa.ParameterizedContext<IState>;

export class Server {

	private readonly globalLogger = new Logger("api-global");
	private readonly emailClient = new EmailClient(this.globalLogger);
	private readonly redisClient = new RedisClient({
		password: config.redisPassword,
		port: config.redisPort,
		db: config.redisDatabase,
		host: config.redisHost
	});

	private authenticate = async(context: CustomContext, next: Function) : Promise<void> => {
		if(context.session.populated) {
			await next();
		} else {
			throw new HttpError(401, ErrorMessage.UNAUTHORIZED, context.state.requestId);
		}
	}

	private attachState = async (context: CustomContext, next: Function) : Promise<void> => {
		context.state.emailClient = this.emailClient;
		context.state.redisClient = this.redisClient;

		await next();
	}

	private errorHandler = async(context: CustomContext, next: Function) : Promise<void> => {
		try {
			await next();
		} catch(error) {
			this.globalLogger.error("Uncaught error", error);

			const httpError = new HttpError(
				500,
				ErrorMessage.INTERNAL_SERVER_ERROR,
				context.state.requestId,
				true
			);

			throwApiError(context, httpError);
		}
	}

	private loggerMiddleware = async (context: CustomContext, next: Function) : Promise<void> => {
		const request = context.request;
		context.state.logger.info(`${request.method} ${request.path}`)

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

		app.use(bodyParser());
		app.use(userAgent);
		app.use(requestIdMiddleware);
		app.use(loggerMiddleware);
		app.use(getSessionMiddleware(this.redisClient));

		app.use(this.attachState);
		app.use(this.errorHandler);

		const openRouter = new Router();
		openRouter.use("/auth", auth.middleware());
		app.use(openRouter.routes());

		const protectedRouter = new Router();
		protectedRouter.use(authenticationMiddleware);
		app.use(protectedRouter.routes());

		this.globalLogger.info("Starting server", {
			port: config.serverPort
		});

		app.listen(config.serverPort);
	}

}
