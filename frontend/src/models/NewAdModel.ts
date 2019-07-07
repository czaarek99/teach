import { INewAdModel } from "../interfaces/models/INewAdModel";
import { observable } from "mobx";
import { INewAdInput } from "common-library";

export class NewAdModel implements INewAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images : File[] = [];

	public toValidate() : INewAdModel {
		return {
			name: this.name,
			description: this.description,
			images: this.images
		};
	}

	public toInput() : INewAdInput {
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