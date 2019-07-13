import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput, IAd, AdCategory } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images = new Map<number, File>();
	@observable public private = false;
	@observable public category : AdCategory | "" = "";

	public fromOutput(ad: IAd) : void {
		this.name = ad.name;
		this.description = ad.description;
		this.private = ad.private;
		this.category = ad.category;
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
		if(this.category === "") {
			throw new Error("Can not construct an ad without a category");
		}

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