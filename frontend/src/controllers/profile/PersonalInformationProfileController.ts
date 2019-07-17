import { observable, action, computed } from "mobx";
import { ValidatorMap, minLength, maxLength, ErrorModel, validate } from "../../validation";
import { ProfilePageController } from "../pages";
import { RootStore } from "../../stores";
import { PersonalInformationModel } from "../../models";
import { LoadingButtonState } from "../../components";
import { createViewModel } from "mobx-utils";
import { objectKeys, successTimeout } from "../../util";

import {
	IPersonalInformationModel,
	IPersonalInformationProfileController,
	IPersonalErrorState
} from "../../interfaces";

import {
	FIRST_NAME_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	PHONE_NUMBER_MAX_LENGTH
} from "common-library";

const validators : ValidatorMap<IPersonalInformationModel> = {
	firstName: [
		minLength(FIRST_NAME_MIN_LENGTH),
		maxLength(FIRST_NAME_MAX_LENGTH)
	],

	lastName: [
		minLength(FIRST_NAME_MIN_LENGTH),
		maxLength(FIRST_NAME_MAX_LENGTH)
	],

	phoneNumber: [
		maxLength(PHONE_NUMBER_MAX_LENGTH)
	]
};

export class PersonalInformationProfileController implements IPersonalInformationProfileController {

	private readonly parent: ProfilePageController;
	private saveButtonStateTimeout?: number;

	@observable private readonly rootStore: RootStore;
	@observable private model = new PersonalInformationModel();

	@observable public loading = true;
	@observable public saveButtonState: LoadingButtonState = "disabled";
	@observable public viewModel = createViewModel(this.model);

	@observable public errorModel = new ErrorModel<IPersonalErrorState>({
		firstName: [],
		lastName: [],
		phoneNumber: []
	});

	constructor(
		rootStore: RootStore,
		parent: ProfilePageController,
	) {
		this.rootStore = rootStore;
		this.parent = parent;
	}

	@computed
	public get showReset() : boolean {
		return this.viewModel.isDirty;
	}

	@action
	public loadUserFromCache() : void {
		if(this.rootStore.userCache.user) {
			this.model.fromJson(this.rootStore.userCache.user);
		}
	}

	@action
	public async load() : Promise<void> {
		this.loading = false;
		this.saveButtonState = "default";
	}

	@action
	public onSave = async () : Promise<void> => {
		clearTimeout(this.saveButtonStateTimeout);

		this.viewModel.submit();
		this.errorModel.submit();

		const input = this.model.toInput();
		for(const key of objectKeys(input)) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";

			try {
				await this.rootStore.services.userService.updatePersonalInfo(input);
				this.saveButtonState = "success";

				this.rootStore.userCache.updatePersonalInfo(input);

				this.viewModel.submit();

				this.saveButtonStateTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				});
			} catch(error) {
				this.parent.serverError(error);

				this.saveButtonState = "error";
			}
		}
	}

	@action
	public onChange(key: keyof IPersonalInformationModel, value: any) : void {
		this.viewModel[key] = value;
		this.validate(key);
	}

	@action
	public onReset = () : void => {
		this.viewModel.reset();
		this.errorModel.clear();
	}

	@action
	private validate(key: keyof IPersonalInformationModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}
}