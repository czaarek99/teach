import { IAdController } from "../interfaces/controllers/IAdController";
import { observable, action, computed } from "mobx";
import { v4 } from "uuid";
import { RouterStore } from "mobx-react-router";
import { Route } from "../interfaces/Routes";
import { IAd } from "common-library";
import { getImageUrl } from "../util/imageAPI";

export class AdController implements IAdController {

	private readonly routingStore: RouterStore;

	@observable public ad: IAd | null = null;
	@observable public readonly controllerId = v4();

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;
	}

	@action
	public load(ad: IAd) : void {
		this.ad = ad;
	}

	@action
	public onClick() : void {
		if(this.ad !== null) {
			const params = new URLSearchParams();
			params.set("adId", this.ad.id.toString());

			this.routingStore.push(`${Route.AD}?${params}`);
		}

	}

	@computed
	public get mainImage() : string {
		if(this.ad && this.ad.images.length > 0) {
			return getImageUrl(this.ad.images[0].fileName);
		}

		return "";
	}

}
