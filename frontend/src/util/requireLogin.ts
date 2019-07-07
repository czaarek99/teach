import { IUserCache } from "./UserCache";
import { RouterStore } from "mobx-react-router";
import { Route } from "../interfaces/Routes";

export async function requireLogin(
	userCache: IUserCache,
	routingStore: RouterStore
) : Promise<boolean> {

	await userCache.recache();

	if(!userCache.isLoggedIn) {
		routingStore.push(Route.LOGIN);

		return false;
	}

	return true;
}