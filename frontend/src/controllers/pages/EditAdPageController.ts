import { IEditAdModel } from "../../interfaces/models/IEditAdModel";
import { observable, action, computed } from "mobx";
import { EditAdModel } from "../../models/EditAdModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate, ValidationResult } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { LoadingButtonState } from "../../components";
import { getImageUrl } from "../../util/imageAPI";
import { successTimeout } from "../../util/successTimeout";
import { requireLogin } from "../../util/requireLogin";
import { RootStore } from "../../stores/RootStore";
import { createViewModel } from "mobx-utils";
import { objectKeys } from "../../util/objectKeys";

import {
	IEditAdPageController,
	IEditAdPageErrorState
} from "../../interfaces/controllers/pages/IEditAdPageController";

import {
	AD_NAME_MIN_LENGTH,
	AD_NAME_MAX_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
	MAX_AD_PICTURE_COUNT,
	ErrorMessage,
	HttpError,
	IAdDeleteIndexesInput,
} from "common-library";

export class EditAdPageController implements IEditAdPageController {

	private readonly validators : ValidatorMap<EditAdModel> = {
		name: [
			minLength(AD_NAME_MIN_LENGTH),
			maxLength(AD_NAME_MAX_LENGTH)
		],
		description: [
			minLength(AD_DESCRIPTION_MIN_LENGTH),
			maxLength(AD_DESCRIPTION_MAX_LENGTH)
		],
		images: [
			this.imagesValidator.bind(this)
		],
		category: [
			this.categoryValidator.bind(this)
		]
	}

	private saveButtonStateTimeout?: number;

	@observable private readonly rootStore: RootStore;
	@observable private readonly imageUrls = new Map<number, string>();
	@observable private model = new EditAdModel();
	@observable private id?: number;

	@observable public pageError = "";
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public viewModel = createViewModel(this.model);
	@observable public isDraggingOver = false;
	@observable public loading = true;
	@observable public imageIndex = 0;
	@observable public descriptionRows = 12;
	@observable public errorModel = new ErrorModel<IEditAdPageErrorState>({
		name: [],
		description: [],
		images: [],
		category: []
	});

	constructor(
		rootStore: RootStore
	) {
		this.rootStore = rootStore;

		this.load();
	}

	private imagesValidator() : ValidationResult {
		if(!this.hasImages) {
			return ErrorMessage.NOT_ENOUGH_AD_IMAGES;
		}

		return null;
	}

	private categoryValidator() : ValidationResult {
		if(!this.viewModel.category) {
			return ErrorMessage.AD_CATEGORY_REQUIRED;
		}

		return null;
	}

	@action
	private async load() : Promise<void> {
		const isLoggedIn = await requireLogin(this.rootStore)
		if(!isLoggedIn) {
			return;
		}

		const searchParams = new URLSearchParams(window.location.search);
		const idString = searchParams.get("adId");

		if(idString) {
			const id = parseInt(idString);

			if(!Number.isNaN(id)) {
				this.id = id;

				const ad = await this.rootStore.services.adService.getAd(this.id);
				this.model.fromOutput(ad);

				for(const image of ad.images) {
					const url = getImageUrl(image.fileName);
					this.imageUrls.set(image.index, url);
				}
			}
		}

		this.loading = false;
	}

	@computed
	public get showReset() : boolean {
		return this.viewModel.isDirty;
	}

	@computed
	private get hasImages() : boolean {
		return this.viewModel.images.size > 0 || this.imageUrls.size > 0;
	}

	@computed
	private get emptySlots() : number[] {
		const slots = [];

		for(let i = 0; i < MAX_AD_PICTURE_COUNT; i++) {
			if(!this.viewModel.images.has(i) && !this.imageUrls.has(i)) {
				slots.push(i);
			}
		}

		return slots;
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
		const url = this.imageUrls.get(index);

		if(url) {
			return url;
		}

		return "";
	}

	@computed
	public get currentImageUrl() : string {
		return this.getImageUrl(this.imageIndex);
	}

	@action
	private validate(key: keyof IEditAdModel) : void {
		const keyValidators = this.validators[key];

		if(keyValidators !== undefined) {
			const value = this.viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	@action
	public onChange(key: keyof IEditAdModel, value: any) : void {
		//Hack, why do we have to do this?
		this.viewModel[key] = value as never;

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

		for(const key of objectKeys(this.viewModel.toValidate())) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";

			try {
				const editAdInput = this.viewModel.toInput();
				const imageInput = this.viewModel.toImageInput();

				if(this.id === undefined) {
					const output = await this.rootStore.services.adService.createAd(editAdInput);
					this.id = output.id
				} else {
					const adDeleteImagesInput : IAdDeleteIndexesInput = {
						indexes: this.emptySlots
					};

					await Promise.all([
						this.rootStore.services.imageService.deleteAdPics(
							this.id,
							adDeleteImagesInput
						),
						this.rootStore.services.adService.updateAd(
							this.id,
							editAdInput
						)
					]);
				}

				const imageOutput = await this.rootStore.services.imageService.updateAdPics(
					this.id,
					imageInput
				);

				for(const image of imageOutput.images) {
					const oldUrl = this.imageUrls.get(image.index);

					if(oldUrl)  {
						URL.revokeObjectURL(oldUrl);
					}

					this.imageUrls.set(image.index, getImageUrl(image.fileName));
				}

				this.saveButtonState = "success";
				this.pageError = "";

				this.viewModel.submit();

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

		const emptySlots = this.emptySlots;

		for(const file of files) {
			const slot = emptySlots.shift();

			if(slot === undefined) {
				break;
			}

			this.viewModel.images.set(slot, file);

			const url = URL.createObjectURL(file);
			this.imageUrls.set(slot, url);
		}

		this.validate("images");
	}

	@action
	public onDeleteImage(index: number) : void {
		this.viewModel.images.delete(index);

		const imageUrl = this.imageUrls.get(index);
		if(imageUrl) {
			URL.revokeObjectURL(imageUrl);
			this.imageUrls.delete(index);
		}

		this.validate("images");
	}

	@action
	public onReset() : void {
		this.viewModel.reset();
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