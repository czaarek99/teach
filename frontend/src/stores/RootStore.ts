import { IServices } from "../interfaces/services/IServices";
import { IUserCache, UserCache } from "./UserCache";
import { RouterStore, syncHistoryWithStore, SynchronizedHistory } from "mobx-react-router";
import { createBrowserHistory } from "history";
import { observable } from "mobx";
import { Route } from "../interfaces/Routes";

export class RootStore {

	@observable public readonly userCache: IUserCache;
	@observable public readonly routingStore: RouterStore;
	public readonly services: IServices;

	constructor(services: IServices) {
		this.services = services;

		this.routingStore = new RouterStore();

		this.userCache = new UserCache(services.userService);
	}

	public getHistory() : SynchronizedHistory {
		return syncHistoryWithStore(createBrowserHistory(), this.routingStore);
	}

	public editAd(id?: number) : void {
		if(id === undefined) {
			this.routingStore.push(Route.EDIT_AD);
		} else {
			this.routingStore.push(`${Route.EDIT_AD}?adId=${id}`);
		}
	}

}