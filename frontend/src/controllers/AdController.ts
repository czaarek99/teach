import { IAdModel } from "../interfaces/models/IAdModel";
import { IAdController } from "../interfaces/controllers/IAdController";
import { observable } from "mobx";
import { v4 } from "uuid";

export class AdController implements IAdController {

	@observable public model: IAdModel | null = null;
	@observable public readonly controllerId = v4();

	public load(ad: IAdModel) : void {
		this.model = ad;
	}

	public get isLoading() : boolean {
		return this.model === null;
	}

}
