import { INewAdModel } from "../interfaces/models/INewAdModel";
import { observable } from "mobx";

export class NewAdModel implements INewAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images : File[] = [];

}