import { Route } from "../interfaces/Route";
import { RootStore } from "../stores/RootStore";

export async function requireLogin(rootStore: RootStore) : Promise<boolean> {

	await rootStore.userCache.recache();

	if(!rootStore.userCache.isLoggedIn) {
		rootStore.routingStore.push(Route.LOGIN);

		return false;
	}

	return true;
}