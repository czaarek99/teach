import * as Koa from "koa";
import * as session from "koa-session";
import * as bodyParser from "koa-bodyparser";

import { HttpError } from "./util/HttpError";

import auth from "./routes/auth";
import { config } from "./config";
import { Logger } from "./util/Logger";

interface IState {
	logger: Logger
}

export type CustomContext = Koa.ParameterizedContext<IState>;

export class Server {

	public startServer() : void {
		const app = new Koa();
		const logger = new Logger();

		app.use(async (context: CustomContext, next: Function) => {
			context.state.logger = logger;

			await next();
		});

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
				throw new HttpError(401, "error.unauthorized");
			}
		});

		
		logger.info(`Starting server on port: ${config.serverPort}`)
		app.listen(config.serverPort);
	}

}
