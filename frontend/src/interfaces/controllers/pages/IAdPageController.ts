import { IAdModel } from "../../models/IAdModel";

export interface IAdPageController {
	readonly model: IAdModel | null;
}