import { HttpError, ErrorMessage } from "common-library";
import { ApiContext } from "../interfaces";
import { throwApiError } from "../throwApiError";

export async function authenticationMiddleware(context: ApiContext, next: Function) : Promise<void> {
	if(context.state.session) {
		await next();
	} else {
		throwApiError(
			context,
			new HttpError(
				401,
				ErrorMessage.UNAUTHORIZED,
				context.state.requestId
			)
		);
	}
}