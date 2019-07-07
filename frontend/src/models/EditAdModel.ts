import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput, IAd, MAX_AD_PICTURE_COUNT } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images : File[] = new Array(MAX_AD_PICTURE_COUNT);

	public fromOutput(ad: IAd) : void {
		this.name = ad.name;
		this.description = ad.description;

		new File([], "");
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

		for(let i = 0; i < this.images.length; i++) {
			const image = this.images[i];
			formData.set(i.toString(), image);
		}

		return formData;
	}

}