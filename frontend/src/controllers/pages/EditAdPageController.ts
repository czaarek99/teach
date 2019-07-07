import { IEditAdModel } from "../../interfaces/models/IEditAdModel";
import { observable, action, computed } from "mobx";
import { EditAdModel } from "../../models/EditAdModel";
import { IAdService } from "../../interfaces/services/IAdService";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { LoadingButtonState } from "../../components";
import { objectKeys } from "../../util/objectKeys";
import { IImageService } from "../../interfaces/services/IImageService";
import { getImageUrl } from "../../util/imageAPI";
import { successTimeout } from "../../util/successTimeout";

import {
	IEditAdPageController,
	IEditAdPageErrorState
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

const validators : ValidatorMap<IEditAdModel> = {
	name: [
		minLength(AD_NAME_MIN_LENGTH),
		maxLength(AD_NAME_MAX_LENGTH)
	],
	description: [
		minLength(AD_DESCRIPTION_MIN_LENGTH),
		maxLength(AD_DESCRIPTION_MAX_LENGTH)
	]
}

export class EditAdPageController implements IEditAdPageController {

	private readonly adService: IAdService;
	private readonly imageService: IImageService;
	private saveButtonStateTimeout?: number;

	@observable private readonly imageUrls: string[] = [];

	@observable public pageError = "";
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public model = new EditAdModel()
	@observable public isDraggingOver = false;
	@observable public loading = true;
	@observable public imageIndex = 0;
	@observable public descriptionRows = 12;
	@observable public errorModel = new ErrorModel<IEditAdPageErrorState>({
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

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const searchParams = new URLSearchParams(window.location.search);
		const idString = searchParams.get("adId");

		if(idString) {
			const id = parseInt(idString);

			const ad = await this.adService.getAd(id);
		}

		this.loading = false;
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
	private validate(key: keyof IEditAdModel) : void {
		if(key === "images") {
			const errors = [];

			if(this.model.images.length === 0) {
				errors.push(ErrorMessage.NOT_ENOUGH_AD_IMAGES);
			}

			this.errorModel.setErrors("images", errors);
		} else {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.model[key];
				this.errorModel.setErrors(key, validate(value, keyValidators));
			}
		}
	}

	@action
	public onChange(key: keyof IEditAdModel, value: any) : void {
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
				this.saveButtonState = "error";

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

		this.validate("images");
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