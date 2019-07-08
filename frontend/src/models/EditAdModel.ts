import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput, IAd, AdCategory } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images = new Map<number, File>();
	@observable public private = false;
	@observable public category = AdCategory.COMPUTER_SCIENCE;

	public fromOutput(ad: IAd) : void {
		this.name = ad.name;
		this.description = ad.description;
		this.private = ad.private;
	}

	public toValidate() : IEditAdModel {
		return {
			name: this.name,
			description: this.description,
			images: this.images,
			private: this.private,
			category: this.category
		};
	}

	public toInput() : IEditAdInput {
		return {
			name: this.name,
			description: this.description,
			private: this.private,
			category: this.category
		};
	}

	public toImageInput() : FormData {
		const formData = new FormData();

		for(const [key, value] of this.images.entries()) {
			formData.set(key.toString(), value);
		}

		return formData;
	}


}