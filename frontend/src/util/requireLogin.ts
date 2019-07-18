import { RootStore } from "../stores";
import { Route } from "../interfaces";

export async function requireLogin(rootStore: RootStore) : Promise<boolean> {

	await rootStore.userCache.recache();

	if(!rootStore.userCache.isLoggedIn) {
		rootStore.routingStore.push(Route.LOGIN);

		return false;
	}

	return true;
}