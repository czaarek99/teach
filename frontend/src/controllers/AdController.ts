import { IAdModel } from "../interfaces/models/IAdModel";
import { IAdController } from "../interfaces/controllers/IAdController";
import { observable } from "mobx";
import { v4 } from "uuid";
import { RouterStore } from "mobx-react-router";
import { Route } from "../interfaces/Routes";

export class AdController implements IAdController {

	private readonly routingStore: RouterStore;

	@observable public model: IAdModel | null = null;
	@observable public readonly controllerId = v4();

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;
	}

	public load(ad: IAdModel) : void {
		this.model = ad;
	}

	public get isLoading() : boolean {
		return this.model === null;
	}

	public onClick() : void {
		if(this.model !== null) {
			const params = new URLSearchParams();
			params.set("adId", this.model.id.toString());

			this.routingStore.push(`${Route.AD}?${params}`);
		}

	}

}
