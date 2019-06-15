import * as Koa from "koa";
import { IApiState, ApiContext } from "../interfaces";
import { Logger } from "../Logger";
import { HttpError, ErrorMessage } from "common-library";
import { throwApiError } from "../throwApiError";

export function getErrorHandler(logger: Logger) : Koa.Middleware<IApiState> {

	return async (context: ApiContext, next: Function) : Promise<void> => {
		try {
			await next();
		} catch(error) {
			logger.error("Uncaught error", error);

			const httpError = new HttpError(
				500,
				ErrorMessage.INTERNAL_SERVER_ERROR,
				context.state.requestId,
				true
			);

			throwApiError(context, httpError);
		}
	}

}