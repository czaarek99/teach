import { IAdModel } from "../interfaces/models/IAdModel";
import { IAdController } from "../interfaces/controllers/IAdController";
import { observable } from "mobx";

export class AdController implements IAdController {

	@observable public model: IAdModel | null = null;

	public load(ad: IAdModel) : void {
		this.model = ad;
	}

	public get isLoading() : boolean {
		return this.model === null;
	}

}