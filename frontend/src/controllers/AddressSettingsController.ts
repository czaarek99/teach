import { observable } from "mobx";
import { ErrorModel } from "../validation/ErrorModel";
import { AddressModel } from "../models/AddressModel";
import { createViewModel } from "mobx-utils";
import { IAddressModel } from "../interfaces/models/IAddressModel";
import { LoadingButtonState } from "../components";
import { minLength, maxLength } from "../validation/validators";
import { validate, ValidatorMap } from "../validation/validate";
import { IUserService } from "../interfaces/services/IUserService";
import { ViewModel } from "../interfaces/ViewModel";
import { IUserCache } from "../util/UserCache";

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
	IAddressSettingsController,
	IAddressErrorState
} from "../interfaces/controllers/IAddressSettingsController";

const addressValidators : ValidatorMap<AddressModel> = {
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

export class AddressSettingsController implements IAddressSettingsController {

	private readonly userService: IUserService;
	private readonly userCache: IUserCache;
	private addressButtonStateTimeout?: number;

	@observable private model = new AddressModel();
	@observable private _viewModel : ViewModel<AddressModel>;

	@observable public viewModel : ViewModel<IAddressModel>;
	@observable public saveButtonState : LoadingButtonState = "disabled";
	@observable public loading = true;

	@observable public errorModel = new ErrorModel<IAddressErrorState>({
		city: [],
		zipCode: [],
		street: [],
		state: []
	});

	constructor(
		userService: IUserService,
		userCache: IUserCache
	) {
		this.userService = userService;
		this.userCache = userCache;

		this._viewModel = createViewModel(this.model);
		this.viewModel = this._viewModel as any;
	}

	public loadUserFromCache() : void {
		if(this.userCache.user) {
			this.model.fromJson(this.userCache.user.address);
		}
	}

	public async load() : Promise<void> {
		this.loading = false;
		this.saveButtonState = "default";
	}

	private validateAddress(key: keyof IAddressModel) : void {
		const keyValidators = addressValidators[key];

		if(keyValidators !== undefined) {
			const value = this._viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	public onReset = () : void => {
		this._viewModel.reset();
	}

	public onChange(key: keyof IAddressModel, value: string) : void {
		this._viewModel[key] = value;
		this.validateAddress(key);
	}

	public onSave = async () : Promise<void> => {
		clearTimeout(this.addressButtonStateTimeout);

		for(const [key] of this._viewModel.changedValues.keys()) {
			this.validateAddress(key as (keyof IAddressModel));
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {

			this.saveButtonState = "loading";
			this._viewModel.submit();

			const address = this.model.toInput();

			try {
				await this.userService.updateAddress(address);
				this.saveButtonState = "success";

				this.addressButtonStateTimeout = window.setTimeout(() => {
					this.saveButtonState = "default";
				}, 3000);
			} catch(error) {
				this.saveButtonState = "error";
			}
		}

	}
}