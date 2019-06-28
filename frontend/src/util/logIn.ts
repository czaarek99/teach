import { RouterStore } from "mobx-react-router";
import { Route } from "../interfaces/Routes";
import { IUserCache } from "./UserCache";

import {
	SESSION_KEY_NAME,
	EXPIRATION_DATE_KEY_NAME,
	USER_KEY_NAME,
	IAuthOutput
} from "common-library";

export async function logIn(
	routingStore: RouterStore,
	authResponse: IAuthOutput,
	userCache: IUserCache
) : Promise<void> {
	localStorage.setItem(SESSION_KEY_NAME, authResponse.sessionId);
	localStorage.setItem(EXPIRATION_DATE_KEY_NAME, authResponse.expirationDate.toString());
	localStorage.setItem(USER_KEY_NAME, JSON.stringify(authResponse.user))

	await userCache.recache();

	setTimeout(() => {
		routingStore.push(Route.BROWSE);
	}, 1000)
}