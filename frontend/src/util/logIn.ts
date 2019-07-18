import { RootStore } from "../stores";
import { Route } from "../interfaces";

import {
	SESSION_KEY_NAME,
	EXPIRATION_DATE_KEY_NAME,
	USER_KEY_NAME,
	IAuthOutput
} from "common-library";

export async function logIn(
	rootStore: RootStore,
	authResponse: IAuthOutput,
) : Promise<void> {
	localStorage.setItem(SESSION_KEY_NAME, authResponse.sessionId);
	localStorage.setItem(EXPIRATION_DATE_KEY_NAME, authResponse.expirationDate.toString());
	localStorage.setItem(USER_KEY_NAME, JSON.stringify(authResponse.user))

	await rootStore.userCache.recache();

	setTimeout(() => {
		rootStore.routingStore.push(Route.BROWSE);
	}, 1000)
}