import { ISettingsPageController, IAccountErrorState } from "../../interfaces/controllers/pages/ISettingsPageController";
import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable } from "mobx";
import { AccountModel } from "../../models/AccountModel";
import { AddressModel } from "../../models/AddressModel";
import { IAccountModel } from "../../interfaces/models/IAccountModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap } from "../../validation/validate";
import { minLength, maxLength } from "../../validation/validators";
import { FIRST_NAME_MIN_LENGTH, FIRST_NAME_MAX_LENGTH, PHONE_NUMBER_MAX_LENGTH } from "common-library";

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

export class SettingsPageController implements ISettingsPageController {

	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public accountModel = new AccountModel();
	@observable public addressModel = new AddressModel();
	@observable public loading = true;
	@observable public accountErrorModel = new ErrorModel<IAccountErrorState>({
		firstName: [],
		lastName: [],
		phoneNumber: []
	});

	constructor(routingStore: RouterStore, userCache: IUserCache) {
		this.routingStore = routingStore;
		this.userCache = userCache;

		this.load();
	}

	private async load() : Promise<void> {
		await this.userCache.recache();

		if(!this.userCache.isLoggedIn) {
			this.routingStore.push(Route.LOGIN);
		}

		this.loading = false;
	}

	public onAccountChange(key: keyof IAccountModel, value: any) : void {
		this.accountModel[key] = value;
	}

}