import * as Koa from "koa";

import { RedisClient } from "../RedisClient";
import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME } from "common-library"
import { isAfter, addDays } from "date-fns";
import { ApiContext, IApiState } from "../interfaces";

export interface IRedisSession {
	userId: number
	expirationDate: number
}

const DAYS_FOR_SESSION_TO_EXPIRE = 7;
export function getNewExpirationDate() : number {
	return addDays(new Date(), DAYS_FOR_SESSION_TO_EXPIRE).getTime();
}

export function getSessionMiddleware(redisClient: RedisClient) : Koa.Middleware<IApiState> {
	return async (context: ApiContext, next: Function) => {
		const sessionId = context.headers[SESSION_HEADER_NAME];

		if(sessionId) {
			const session = await redisClient.getJSON<IRedisSession>(sessionId);

			if(session) {
				const expirationDate = new Date(session.expirationDate);
				const now = new Date();

				if(isAfter(expirationDate, now)) {
					const newExpirationDate = getNewExpirationDate();

					await redisClient.setJSONValue<IRedisSession>(
						sessionId,
						"expirationDate",
						newExpirationDate
					);

					context.state.session = {
						userId: session.userId
					}
				} else {
					await this.redisClient.deleteJSONObject(sessionId);
				}
			}
		}

		await next();
	}
}