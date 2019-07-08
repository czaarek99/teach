import { RootStore } from "../stores/RootStore";
import { Route } from "../interfaces/Routes";

export async function requireNoLogin(rootStore: RootStore) : Promise<boolean> {
	await rootStore.userCache.recache();

	if(rootStore.userCache.isLoggedIn) {
		rootStore.routingStore.push(Route.BROWSE);
		return false;
	}

	return true;
}