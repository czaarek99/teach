import { CustomContext } from "../Server";
import { ErrorMessage, HttpError } from "common-library";

export async function authMiddleware(context: CustomContext, next: Function) {
	if(context.session.populated) {
		await next();
	} else {
		throw new HttpError(401, ErrorMessage.UNAUTHORIZED, context.state.requestId);
	}
}