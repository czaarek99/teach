import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images : File[] = [];

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

		for(let i = 0; i < this.images.length; i++) {
			const image = this.images[i];
			formData.set(i.toString(), image);
		}

		return formData;
	}

}