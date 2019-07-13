import { observable } from "mobx";
import { ErrorModel } from "../../validation/ErrorModel";
import { IPersonalInformationModel } from "../../interfaces/models/IPersonalInformationModel";
import { ViewModel } from "../../interfaces/ViewModel";
import { PersonalInformationModel } from "../../models/PersonalInformationModel";
import { createViewModel } from "mobx-utils";
import { minLength, maxLength } from "../../validation/validators";
import { ValidatorMap, validate } from "../../validation/validate";
import { LoadingButtonState } from "../../components";
import { objectKeys } from "../../util/objectKeys";
import { successTimeout } from "../../util/successTimeout";
import { ProfilePageController } from "../pages/ProfilePageController";
import { RootStore } from "../../stores/RootStore";

import {
	IPersonalInformationProfileController,
	IPersonalErrorState
} from "../../interfaces/controllers/profile/IPersonalInformationProfileController";

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

	public loadUserFromCache() : void {
		if(this.rootStore.userCache.user) {
			this.model.fromJson(this.rootStore.userCache.user);
		}
	}

	public async load() : Promise<void> {
		this.loading = false;
		this.saveButtonState = "default";
	}

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

	public onChange(key: keyof IPersonalInformationModel, value: any) : void {
		this.viewModel[key] = value;
		this.validate(key);
	}

	public onReset = () : void => {
		this.viewModel.reset();
		this.errorModel.reset();
	}

	private validate(key: keyof IPersonalInformationModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}
}