import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as userAgent from "koa-useragent";

import auth from "./routes/auth";

import { config } from "./config";
import { v4 } from "uuid";
import { HttpError, ErrorMessage } from "common-library";
import { EmailClient } from "./email/EmailClient";
import { verifyRecaptcha } from "./util/verifyRecaptcha";
import { connectToDatabase } from "./database/connection";
import { Logger, RedisClient } from "server-lib";
import { subDays, isBefore } from "date-fns";

interface ISession {
	userId: number
}

interface IState {
	requestId: string
	emailClient: EmailClient
	redisClient: RedisClient
	logger: Logger
	session: ISession
	throwApiError: (error: HttpError) => void
	verifyRecaptcha: (captcha: string) => Promise<boolean>
}

export interface IRedisSession {
	userId: number
	updateDate: number
}

export type CustomContext = Koa.ParameterizedContext<IState>;

const DAYS_FOR_SESSION_TO_EXPIRE = 7;
export const SESSION_COOKIE_NAME  = "sessionId";

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

	private attachSession = async(context: CustomContext, next: Function) : Promise<void> => {
		const sessionId = context.cookies.get(SESSION_COOKIE_NAME);

		if(sessionId) {
			const session = await this.redisClient.getJSON<IRedisSession>(sessionId);

			if(session) {
				const updateDate = new Date(session.updateDate);

				const now = new Date();

				const lastAlllowedDate = subDays(now, DAYS_FOR_SESSION_TO_EXPIRE);

				if(isBefore(updateDate, lastAlllowedDate)) {
					await this.redisClient.deleteJSONObject(sessionId);
				} else {
					await this.redisClient.setJSONValue<IRedisSession>(
						sessionId, 
						"updateDate", 
						now.getTime()
					);

					context.state.session = {
						userId: session.userId
					}
				}


			}
		} 

		await next();
	
	}

	private attachState = async (context: CustomContext, next: Function) : Promise<void> => {
		context.state.requestId = v4();
		context.state.emailClient = this.emailClient;
		context.state.redisClient = this.redisClient;

		const loggerData = {
			requestId: context.state.requestId,
			userId: undefined
		};

		if(context.state.session) {
			loggerData.userId = context.state.session.userId;
		}

		context.state.logger = new Logger("api-request", loggerData);

		context.state.throwApiError = (error: HttpError) : void => {
			context.body = error.toJSON();
			context.status = error.statusCode;

			context.state.logger.info("Api error", error.toJSON());
		}

		context.state.verifyRecaptcha = async (captcha: string) : Promise<boolean> => {
			const success = await verifyRecaptcha(captcha, context.ip);

			if(success) {
				return true;
			} else {
				context.state.throwApiError(new HttpError(400, ErrorMessage.BAD_CAPTCHA));
				return false;
			}
		}

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

			context.state.throwApiError(httpError);
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
		app.use(this.attachSession);
		app.use(this.attachState);
		app.use(this.errorHandler);
		app.use(this.loggerMiddleware);


		const openRouter = new Router();
		openRouter.use("/auth", auth.middleware());
		app.use(openRouter.routes());

		const protectedRouter = new Router();
		protectedRouter.use(this.authenticate);
		app.use(protectedRouter.routes());

		this.globalLogger.info("Starting server", {
			port: config.serverPort
		});

		app.listen(config.serverPort);
	}

}
