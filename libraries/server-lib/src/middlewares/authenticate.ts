import { HttpError, ErrorMessage } from "common-library";
import { ApiContext } from "../interfaces";

export async function authenticationMiddleware(context: ApiContext, next: Function) : Promise<void> {
	if(context.state.session) {
		await next();
	} else {
		throw new HttpError(401, ErrorMessage.UNAUTHORIZED, context.state.requestId);
	}
}