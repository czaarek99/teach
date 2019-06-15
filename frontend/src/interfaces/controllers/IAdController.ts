import { IAdModel } from "../models/IAdModel";
import { IAd } from "common-library";

export interface IAdController {
	readonly model: IAdModel | null

	load: (ad: IAdModel) => void
}