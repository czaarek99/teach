import { INewAdModel } from "../../interfaces/models/INewAdModel";
import { observable, action, computed } from "mobx";
import { NewAdModel } from "../../models/NewAdModel";
import { IAdService } from "../../interfaces/services/IAdService";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { LoadingButtonState } from "../../components";
import { objectKeys } from "../../util/objectKeys";
import { IImageService } from "../../interfaces/services/IImageService";

import {
	INewAdPageController,
	INewAdPageErrorState
} from "../../interfaces/controllers/pages/INewAdPageController";

import {
	AD_NAME_MIN_LENGTH,
	AD_NAME_MAX_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
	MAX_AD_PICTURE_COUNT,
	ErrorMessage,
	HttpError
} from "common-library";
import { getImageUrl } from "../../util/imageAPI";
import { successTimeout } from "../../util/successTimeout";

const validators : ValidatorMap<INewAdModel> = {
	name: [
		minLength(AD_NAME_MIN_LENGTH),
		maxLength(AD_NAME_MAX_LENGTH)
	],
	description: [
		minLength(AD_DESCRIPTION_MIN_LENGTH),
		maxLength(AD_DESCRIPTION_MAX_LENGTH)
	]
}

export class NewAdPageController implements INewAdPageController {

	private readonly adService: IAdService;
	private readonly imageService: IImageService;
	private saveButtonStateTimeout?: number;

	@observable private readonly imageUrls: string[] = [];

	@observable public pageError = "";
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public model = new NewAdModel()
	@observable public isDraggingOver = false;
	@observable public loading = false;
	@observable public imageIndex = 0;
	@observable public descriptionRows = 12;
	@observable public errorModel = new ErrorModel<INewAdPageErrorState>({
		name: [],
		description: [],
		images: []
	});

	constructor(
		adService: IAdService,
		imageService: IImageService
	) {
		this.adService = adService;
		this.imageService = imageService;
	}

	@action
	public onWindowResize = () : void => {
		if(window.innerWidth > 1400) {
			this.descriptionRows = 16;
		} else {
			this.descriptionRows = 12;
		}
	}

	public getImageUrl(index: number) : string {
		if(this.imageUrls.length > index) {
			return this.imageUrls[index];
		}

		return "";
	}

	@computed
	public get currentImageUrl() : string {
		return this.getImageUrl(this.imageIndex);
	}

	@action
	private validate(key: keyof INewAdModel) : void {
		if(key === "images") {
			if(this.model.images.length === 0) {
				this.errorModel.setErrors("images", [
					ErrorMessage.NOT_ENOUGH_AD_IMAGES
				]);
			}
		} else {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.model[key];
				this.errorModel.setErrors(key, validate(value, keyValidators));
			}
		}
	}

	@action
	public onChange(key: keyof INewAdModel, value: any) : void {
		this.model[key] = value;

		this.validate(key);
	}

	@action
	public onDragEnter() : void {
		this.isDraggingOver = true;
	}

	@action
	public onDragLeave() : void {
		this.isDraggingOver = false;
	}

	@action
	public async onSave() : Promise<void> {
		clearTimeout(this.saveButtonStateTimeout);

		const toValidate = this.model.toValidate();
		for(const key of objectKeys(toValidate)) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";

			try {
				const input = this.model.toInput();
				const imageInput = this.model.toImageInput();

				const output = await this.adService.createAd(input);

				const imageOutput = await this.imageService.updateAdPics(
					output.id,
					imageInput
				);

				for(const image of imageOutput.images) {
					const oldUrl = this.imageUrls[image.index];
					URL.revokeObjectURL(oldUrl);

					this.imageUrls[image.index] = getImageUrl(image.fileName);
				}

				this.saveButtonState = "success";
				this.pageError = "";

				this.saveButtonStateTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				})
			} catch(error) {
				if(error instanceof HttpError) {
					this.pageError = error.error;
				} else {
					console.error(error)
					this.pageError = ErrorMessage.COMPONENT;
				}
			}
		}
	}

	@action
	public onDrop = (files: File[]) : void => {
		this.isDraggingOver = false;

		for(const file of files) {
			if(this.model.images.length >= MAX_AD_PICTURE_COUNT) {
				break;
			}

			this.model.images.push(file);

			const url = URL.createObjectURL(file);
			this.imageUrls.push(url);
		}
	}

	@action
	public onDeleteImage(index: number) : void {
		if(this.model.images.length > index) {
			this.model.images.splice(index, 1);

			const url = this.imageUrls[index];
			URL.revokeObjectURL(url);

			this.imageUrls.splice(index, 1);
		}
	}

	@action
	public setImageIndex(index: number) : void {
		this.imageIndex = index;
	}

	@action
	public onCloseSnackbar() : void {
		this.pageError = "";
	}
}