import { ApiContext } from "../interfaces";
import { Logger } from "../Logger";

export async function loggerMiddleware(context: ApiContext, next: Function) : Promise<void> {
	const loggerData = {
		requestId: context.state.requestId,
		userId: undefined
	};

	if(context.state.session) {
		loggerData.userId = context.state.session.userId;
	}

	
	const logger = new Logger("api-request", loggerData);
	context.state.logger = logger;

	logger.info(`${context.method} ${context.path}`);

	await next();
}