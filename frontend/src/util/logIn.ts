import { RouterStore } from "mobx-react-router";
import { Route } from "../interfaces/Routes";

export function logIn(routingStore: RouterStore) : void {
	setTimeout(() => {
		routingStore.push(Route.BROWSE);
	}, 1000)
}