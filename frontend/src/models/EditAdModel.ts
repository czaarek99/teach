import { IEditAdModel } from "../interfaces/models/IEditAdModel";
import { observable } from "mobx";
import { IEditAdInput, IAd } from "common-library";

export class EditAdModel implements IEditAdModel {

	@observable public name = "";
	@observable public description = "";
	@observable public images = new Map<number, File>();
	@observable public private = false;

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
			private: this.private
		};
	}

	public toInput() : IEditAdInput {
		return {
			name: this.name,
			description: this.description,
			private: this.private
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