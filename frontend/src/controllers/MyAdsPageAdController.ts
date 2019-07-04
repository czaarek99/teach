import { IAdController } from "../interfaces/controllers/IAdController";
import { observable, action } from "mobx";
import { IAd } from "common-library";
import { v4 } from "uuid";

export class MyAdsPageAdController implements IAdController {

	@observable public ad: IAd | null = null;
	@observable public readonly controllerId = v4();

	constructor(ad: IAd) {
		this.load(ad);
	}

	@action
	public load(ad: IAd) : void {
		this.ad = ad;
	}

	@action
	public onClick() : void {
		if(this.ad !== null) {
			//Redirect to edit page
		}
	}

}