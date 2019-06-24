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
			let httpError: HttpError;

			//koa-joi-validator errors
			if(error.name === "ValidationError") {
				httpError = new HttpError(
					400,
					error.message,
					context.state.requestId,
					true
				);

			} else {
				logger.error("Uncaught error", {
					errorMessage: error.message
				});

				httpError = new HttpError(
					500,
					ErrorMessage.INTERNAL_SERVER_ERROR,
					context.state.requestId,
					true
				);
			}

			throwApiError(context, httpError);
		}
	}

}