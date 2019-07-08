import { CustomContext } from "../Server";
import { throwApiError } from "server-lib";
import { HttpError, ErrorMessage } from "common-library";

export function throwAdNotFound(context: CustomContext) : void {
	throwApiError(
		context,
		new HttpError(
			404,
			ErrorMessage.AD_NOT_FOUND,
			context.state.requestId
		)
	);
}