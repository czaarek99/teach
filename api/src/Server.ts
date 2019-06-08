import * as Koa from "koa";
import * as session from "koa-session";
import * as bodyParser from "koa-bodyparser";
import * as Router from "koa-router";
import * as userAgent from "koa-useragent";

import auth from "./routes/auth";

import { config } from "./config";
import { Logger } from "./util/Logger";
import { v4 } from "uuid";
import { HttpError, ErrorMessage } from "common-library";
import { authMiddleware } from "./middleware/auth";
import { connection } from "./database/connection";
import { EmailClient } from "./email/EmailClient";

interface IState {
	logger: Logger
	emailClient: EmailClient
	requestId: string
	throwApiError: (error: HttpError) => void
}

export type CustomContext = Koa.ParameterizedContext<IState>;

export class Server {

	private readonly globalLogger = new Logger("api-global");

	public async startDatabase() : Promise<void> {
		await connection.sync({
			force: config.isDevelopment
		});
	}

	public startServer() : void {
		const app = new Koa();

		app.keys = config.applicationKeys;

		const emailClient = new EmailClient(this.globalLogger);

		app.use(async (context: CustomContext, next: Function) => {
			context.state.requestId = v4();
			context.state.emailClient = emailClient;

			context.state.logger = new Logger("api-request", {
				requestId: context.state.requestId,
				userId: context.session.userId
			});

			context.state.throwApiError = (error: HttpError) => {
				context.body = error.toJSON();
				context.status = error.statusCode;

				context.state.logger.info("Api error", error.toJSON());
			}

			const request = context.request;
			context.state.logger.info(`${request.method} ${request.path}`)

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
		});

		app.use(userAgent);
		app.use(bodyParser());

		app.use(session({
			maxAge: 7 * 24 * 60 * 60,
			rolling: true
		}, app));


		const openRouter = new Router();
		openRouter.use("/auth", auth.middleware());
		app.use(openRouter.routes());

		const protectedRouter = new Router();
		protectedRouter.use(authMiddleware);
		app.use(protectedRouter.routes());

		this.globalLogger.info("Starting server", {
			port: config.serverPort
		});

		app.listen(config.serverPort);
	}

}
