import { ApiContext } from "./interfaces";
import { HttpError } from "common-library";

export function throwApiError(context: ApiContext, error: HttpError) : void {
	const jsonError = error.toJSON();

	context.body = jsonError;
	context.status = error.statusCode;

	context.state.logger.info("API Error", jsonError)
}