import { IAdPageController } from "../../interfaces/controllers/pages/IAdPageController";
import { observable } from "mobx";
import { IAdModel } from "../../interfaces/models/IAdModel";

export class AdPageController implements IAdPageController {

	@observable public model: IAdModel | null = null;

}