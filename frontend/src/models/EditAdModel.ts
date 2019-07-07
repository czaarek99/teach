import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput, IAd } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images = new Map<number, File>();

	public fromOutput(ad: IAd) : void {
		this.name = ad.name;
		this.description = ad.description;
	}

	public toValidate() : IEditAdModel {
		return {
			name: this.name,
			description: this.description,
			images: this.images
		};
	}

	public toInput() : IEditAdInput {
		return {
			name: this.name,
			description: this.description
		};
	}

	public toImageInput() : FormData {
		const formData = new FormData();
		formData.set("test", "test");

		for(const [key, value] of this.images.entries()) {
			formData.set(key.toString(), value);
		}

		return formData;
	}


}