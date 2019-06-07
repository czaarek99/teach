import { RouterStore } from "mobx-react-router";
import { Routes } from "../interfaces/Routes";

export function logIn(routingStore: RouterStore) : void {
	setTimeout(() => {
		routingStore.push(Routes.BROWSE);
	}, 1000)
}