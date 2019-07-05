import { INewAdModel } from "../../interfaces/models/INewAdModel";
import { observable, action, computed } from "mobx";
import { NewAdModel } from "../../models/NewAdModel";
import { IAdService } from "../../interfaces/services/IAdService";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { LoadingButtonState } from "../../components";

import {
	INewAdPageController,
	INewAdPageErrorState
} from "../../interfaces/controllers/pages/INewAdPageController";

import {
	AD_NAME_MIN_LENGTH,
	AD_NAME_MAX_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH
} from "common-library";

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

	@observable private readonly imageUrls: string[] = [];
	@observable private readonly adImages: File[] = [];

	@observable public pageError = "";
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public model = new NewAdModel()
	@observable public isDraggingOver = false;
	@observable public loading = false;
	@observable public imageIndex = 0;
	@observable public errorModel = new ErrorModel<INewAdPageErrorState>({
		name: [],
		description: []
	});

	constructor(adService: IAdService) {
		this.adService = adService;
	}

	public getImageUrl(index: number) : string {
		if(this.imageUrls.length > index) {
			return this.imageUrls[index];
		}

		return "";
	}

	@computed
	public get imageUrl() : string {
		return this.getImageUrl(this.imageIndex);
	}

	@action
	private validate(key: keyof INewAdModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
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

	}

	@action
	public onDrop = (files: File[]) : void => {
		this.adImages[this.imageIndex] = file;

		if(this.imageUrls.length > this.imageIndex) {
			const oldUrl = this.imageUrls[this.imageIndex];
			if(oldUrl) {
				URL.revokeObjectURL(oldUrl);
			}
		}

		this.imageUrls[this.imageIndex] = URL.createObjectURL(file);
	}

	@action
	public setImageIndex(index: number) : void {
		this.imageIndex = index;
	}

	@action
	public onCloseSnackbar() : void {
		this.pageError = "";
	}

	public isImageSlotEnabled(slotIndex: number) : boolean {
		return this.adImages.length >= slotIndex;
	}

}