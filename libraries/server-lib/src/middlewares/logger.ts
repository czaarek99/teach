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

	
	context.state.logger = new Logger("api-request", loggerData);

	await next();
}