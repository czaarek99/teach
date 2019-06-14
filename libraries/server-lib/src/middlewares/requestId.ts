import { ApiContext } from "../interfaces";
import { v4 } from "uuid";

export async function requestIdMiddleware(context: ApiContext, next: Function) : Promise<void> {
	context.state.requestId = v4();

	await next();
}