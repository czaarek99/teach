import { observable, action, computed } from "mobx";
import { v4 } from "uuid";
import { IAd } from "common-library";
import { RootStore } from "../stores";
import { IAdController, Route } from "../interfaces";
import { getImageUrl } from "../util";

export class AdController implements IAdController {

	@observable private readonly rootStore: RootStore;

	@observable public ad: IAd | null = null;
	@observable public readonly controllerId = v4();

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
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

			this.rootStore.routingStore.push(`${Route.AD}?${params}`);
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
