import { IAdModel } from "../models/IAdModel";
import { IAd } from "common-library";

export interface IAdController {
	readonly model: IAdModel | null
	readonly controllerId: string

	onClick: () => void
	load: (ad: IAdModel) => void
}
