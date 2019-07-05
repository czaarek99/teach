import { INewAdModel } from "../../interfaces/models/INewAdModel";
import { observable } from "mobx";
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

	@observable public pageError = "";
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public model = new NewAdModel()
	@observable public errorModel = new ErrorModel<INewAdPageErrorState>({
		name: [],
		description: []
	});

	constructor(adService: IAdService) {
		this.adService = adService;
	}

	private validate(key: keyof INewAdModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	public onChange(key: keyof INewAdModel, value: any) : void {
		this.model[key] = value;

		this.validate(key);
	}

	public async onSave() : Promise<void> {

	}

	public onCloseSnackbar() : void {
		this.pageError = "";
	}

}