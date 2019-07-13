import { observable, action, computed } from "mobx";
import { ErrorModel } from "../../validation/ErrorModel";
import { AddressModel } from "../../models/AddressModel";
import { createViewModel } from "mobx-utils";
import { LoadingButtonState } from "../../components";
import { minLength, maxLength } from "../../validation/validators";
import { validate, ValidatorMap } from "../../validation/validate";
import { successTimeout } from "../../util/successTimeout";
import { RootStore } from "../../stores/RootStore";
import { ProfilePageController } from "../pages/ProfilePageController";
import { IAddressModel } from "../../interfaces/models/IAddressModel";
import { objectKeys } from "../../util/objectKeys";

import {
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	STATE_MAX_LENGTH
} from "common-library";

import {
	IAddressProfileController,
	IAddressErrorState
} from "../../interfaces/controllers/profile/IAddressProfileController";

const validators : ValidatorMap<IAddressModel> = {
	city: [
		minLength(CITY_MIN_LENGTH),
		maxLength(CITY_MAX_LENGTH)
	],

	zipCode: [
		minLength(ZIP_CODE_MIN_LENGTH),
		maxLength(ZIP_CODE_MAX_LENGTH)
	],

	street: [
		minLength(STREET_MIN_LENGTH),
		maxLength(STREET_MAX_LENGTH)
	],

	state: [
		maxLength(STATE_MAX_LENGTH)
	]
}

export class AddressProfileController implements IAddressProfileController {

	private readonly rootStore: RootStore;
	private readonly parent: ProfilePageController;

	private addressButtonStateTimeout?: number;

	@observable private model = new AddressModel();

	@observable public viewModel = createViewModel(this.model);
	@observable public saveButtonState : LoadingButtonState = "disabled";
	@observable public loading = true;

	@observable public errorModel = new ErrorModel<IAddressErrorState>({
		city: [],
		zipCode: [],
		street: [],
		state: []
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
			this.model.fromJson(this.rootStore.userCache.user.address);
		}
	}

	@action
	public async load() : Promise<void> {
		this.loading = false;
		this.saveButtonState = "default";
	}

	@action
	private validate(key: keyof IAddressModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	@action
	public onReset = () : void => {
		this.viewModel.reset();
		this.errorModel.reset();
	}

	@action
	public onChange(key: keyof IAddressModel, value: any) : void {
		this.viewModel[key] = value;
		this.validate(key);
	}

	@action
	public onSave = async () : Promise<void> => {
		clearTimeout(this.addressButtonStateTimeout);

		this.errorModel.submit();
		this.viewModel.submit();

		const input = this.viewModel.toInput();
		for(const key of objectKeys(input)) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";

			try {
				await this.rootStore.services.userService.updateAddress(input);
				this.saveButtonState = "success";

				this.rootStore.userCache.updateAddress(input);

				this.viewModel.submit();

				this.addressButtonStateTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				});
			} catch(error) {
				this.saveButtonState = "error";
				this.parent.serverError(error);
			}
		}

	}
}