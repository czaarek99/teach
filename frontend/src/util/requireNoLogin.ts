import { RootStore } from "../stores";
import { Route } from "../interfaces";

export async function requireNoLogin(rootStore: RootStore) : Promise<boolean> {
	await rootStore.userCache.recache();

	if(rootStore.userCache.isLoggedIn) {
		rootStore.routingStore.push(Route.BROWSE);
		return false;
	}

	return true;
}