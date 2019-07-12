import { IAdFilterModel } from "../interfaces/models/IAdFilterModel";
import { observable } from "mobx";
import { AdCategory, IAdListInput } from "common-library";

export class AdFilterModel implements IAdFilterModel {

	@observable public category : AdCategory | "" = "";
	@observable public startPublishDate?: Date;
	@observable public endPublishDate?: Date;
	@observable public searchText = "";

	public clear() : void {
		this.category = "";
		this.searchText = "";
		this.startPublishDate = undefined;
		this.endPublishDate = undefined;
	}

	public toInput(offset: number, limit: number) : IAdListInput {
		return {
			category: this.category,
			startDate: this.startPublishDate,
			endDate: this.endPublishDate,
			search: this.searchText,
			offset,
			limit
		}
	}

}