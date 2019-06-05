import * as Koa from "koa";
import * as session from "koa-session";
import * as bodyParser from "koa-bodyparser";


import auth from "./routes/auth";
import { config } from "./config";
import { Logger } from "./util/Logger";
import { v4 } from "uuid";
import { HttpError, ErrorMessage } from "common-library";
import { inspect } from "util";

interface IState {
	logger: Logger
	requestId: string
}

export type CustomContext = Koa.ParameterizedContext<IState>;

export class Server {

	private readonly globalLogger = new Logger("api-global");

	public startServer() : void {
		const app = new Koa();

		app.use(async (context: CustomContext, next: Function) => {
			context.state.requestId = v4();
			context.state.logger = new Logger("api-request", {
				requestId: context.state.requestId,
				userId: context.session.userId
			});

			const request = context.request;
			context.state.logger.info(`${request.method} ${request.path}`)

			try {
				await next();
			} catch(error) {
				if(error instanceof HttpError) {
					context.response.body = error.toJSON();
					context.response.status = error.statusCode;
				} else {
					this.globalLogger.error(inspect(error, {
						depth: Infinity
					}));

					const httpError = new HttpError(
						500, 
						"Internal server error. Contact the administrator", 
						context.state.requestId, 
						true
					);

					context.response.body = httpError.toJSON() ;
					context.respone.status = httpError.statusCode;
				}
			}
		})

		app.use(bodyParser());

		app.use(session({
			maxAge: 7 * 24 * 60 * 60,
			rolling: true
		}, app));

		app.use(auth.middleware());

		app.use(async (context: CustomContext, next: Function) => {
			if(context.session.populated) {
				await next();
			} else {
				throw new HttpError(401, ErrorMessage.UNAUTHORIZED, context.state.requestId);
			}
		});

		
		this.globalLogger.info(`Starting server on port: ${config.serverPort}`)
		app.listen(config.serverPort);
	}

}
