import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable } from "mobx";
import { PersonalInformationModel } from "../../models/PersonalInformationModel";
import { AddressModel } from "../../models/AddressModel";
import { IPersonalInformationModel } from "../../interfaces/models/IPersonalInformationModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { IAddressModel } from "../../interfaces/models/IAddressModel";
import { createViewModel } from "mobx-utils";
import { ViewModel } from "../../interfaces/ViewModel";
import { IUserService } from "../../interfaces/services/IUserService";
import { LoadingButtonState } from "../../components";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	PHONE_NUMBER_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	STATE_MAX_LENGTH
} from "common-library";

import {
	ISettingsPageController,
	IPersonalErrorState,
	IAddressErrorState
} from "../../interfaces/controllers/pages/ISettingsPageController";
import { objectKeys } from "../../util/objectKeys";

const personalValidators : ValidatorMap<IPersonalInformationModel> = {
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

export class SettingsPageController implements ISettingsPageController {

	private readonly userService: IUserService;
	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	private addressButtonStateTimeout?: number;
	private personalButtonStateTimeout?: number;

	@observable private personalModel = new PersonalInformationModel();
	@observable private addressModel = new AddressModel();

	@observable private _personalViewModel : ViewModel<PersonalInformationModel>;
	@observable private _addressViewModel : ViewModel<AddressModel>;

	@observable public personalViewModel : ViewModel<IPersonalInformationModel>;
	@observable public addressViewModel : ViewModel<IAddressModel>;
	@observable public addressSaveButtonState : LoadingButtonState = "disabled";
	@observable public personalSaveButtonState: LoadingButtonState = "disabled";

	@observable public loading = true;

	@observable public personalErrorModel = new ErrorModel<IPersonalErrorState>({
		firstName: [],
		lastName: [],
		phoneNumber: []
	});

	@observable public addressErrorModel = new ErrorModel<IAddressErrorState>({
		city: [],
		zipCode: [],
		street: [],
		state: []
	});

	constructor(
		userService: IUserService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.userService = userService;
		this.routingStore = routingStore;
		this.userCache = userCache;

		this._personalViewModel = createViewModel(this.personalModel);
		this._addressViewModel = createViewModel(this.addressModel);

		this.personalViewModel = this._personalViewModel as any;
		this.addressViewModel = this._addressViewModel as any;

		this.load();
	}

	private loadUserFromCache() : void {
		if(this.userCache.user) {
			this.personalModel.fromJson(this.userCache.user);
			this.addressModel.fromJson(this.userCache.user.address);
		}
	}

	private async load() : Promise<void> {
		this.loadUserFromCache();

		await this.userCache.recache();

		if(!this.userCache.isLoggedIn) {
			this.routingStore.push(Route.LOGIN);
		}

		this.loadUserFromCache();

		this.addressSaveButtonState = "default";
		this.personalSaveButtonState = "default";

		this.loading = false;
	}

	private validatePersonal(key: keyof IPersonalInformationModel) : void {
		const keyValidators = personalValidators[key];

		if(keyValidators !== undefined) {
			const value = this._personalViewModel[key];
			this.personalErrorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	private validateAddress(key: keyof IAddressModel) : void {
		const keyValidators = addressValidators[key];

		if(keyValidators !== undefined) {
			const value = this._addressViewModel[key];
			this.addressErrorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	public onPersonalReset = () : void => {
		this._personalViewModel.reset();
	}

	public onAddressReset = () : void => {
		this._addressViewModel.reset();
	}

	public onPersonalChange(key: keyof IPersonalInformationModel, value: any) : void {
		this._personalViewModel[key] = value;
		this.validatePersonal(key);
	}

	public onAddressChange(key: keyof IAddressModel, value: string) : void {
		this._addressViewModel[key] = value;
		this.validateAddress(key);
	}

	public onPersonalSave = async () : Promise<void> => {
		clearTimeout(this.personalButtonStateTimeout);
		this.personalSaveButtonState = "loading";
		this._personalViewModel.submit();

		const input = this.personalModel.toInput();

		try {
			await this.userService.updatePersonalInfo(input);
			this.personalSaveButtonState = "success";

			this.userCache.updatePersonalInfo(input);

			this.personalButtonStateTimeout = window.setTimeout(() => {
				this.personalSaveButtonState = "default";
			}, 3000);
		} catch(error) {
			this.personalSaveButtonState = "error";
		}
	}

	public onAddressSave = async () : Promise<void> => {
		clearTimeout(this.addressButtonStateTimeout);

		for(const [key] of this._addressViewModel.changedValues.keys()) {
			this.validateAddress(key as (keyof IAddressModel));
		}

		if(this.addressErrorModel.hasErrors()) {
			this.addressSaveButtonState = "error";
		} else {

			this.addressSaveButtonState = "loading";
			this._addressViewModel.submit();

			const address = this.addressModel.toInput();

			try {
				await this.userService.updateAddress(address);
				this.addressSaveButtonState = "success";

				this.addressButtonStateTimeout = window.setTimeout(() => {
					this.addressSaveButtonState = "default";
				}, 3000);
			} catch(error) {
				this.addressSaveButtonState = "error";
			}
		}

	}

}