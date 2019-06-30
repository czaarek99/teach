import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable, computed } from "mobx";
import { AccountModel } from "../../models/AccountModel";
import { AddressModel } from "../../models/AddressModel";
import { IAccountModel } from "../../interfaces/models/IAccountModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { IAddressModel } from "../../interfaces/models/IAddressModel";
import { createViewModel } from "mobx-utils";

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
	IAccountErrorState,
	IAddressErrorState
} from "../../interfaces/controllers/pages/ISettingsPageController";
import { ViewModel } from "../../interfaces/ViewModel";

const accountValidators : ValidatorMap<IAccountModel> = {
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

	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable private accountModel = new AccountModel();
	@observable private addressModel = new AddressModel();

	@observable private _accountViewModel : ViewModel<AccountModel>;
	@observable private _addressViewModel : ViewModel<AddressModel>;

	@observable public accountViewModel : ViewModel<IAccountModel>;
	@observable public addressViewModel : ViewModel<IAddressModel>;

	@observable public loading = true;

	@observable public accountErrorModel = new ErrorModel<IAccountErrorState>({
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

	constructor(routingStore: RouterStore, userCache: IUserCache) {
		this.routingStore = routingStore;
		this.userCache = userCache;

		this._accountViewModel = createViewModel(this.accountModel);
		this._addressViewModel = createViewModel(this.addressModel);

		this.accountViewModel = this._accountViewModel as any;
		this.addressViewModel = this._addressViewModel as any;

		this.load();
	}

	private async load() : Promise<void> {
		await this.userCache.recache();

		if(!this.userCache.isLoggedIn) {
			this.routingStore.push(Route.LOGIN);
		}

		this.loading = false;
	}

	public onAccountReset = () : void => {
		this._accountViewModel.reset();
	}

	public onAddressReset = () : void => {
		this._addressViewModel.reset();
	}

	public onAccountChange(key: keyof IAccountModel, value: any) : void {
		this._accountViewModel[key] = value;
	}

	public onAddressChange(key: keyof IAddressModel, value: string) : void {
		this._addressViewModel[key] = value;
	}

	public onAccountSave = async () : Promise<void> => {

	}

	public onAddressSave = async () : Promise<void> => {

	}

}