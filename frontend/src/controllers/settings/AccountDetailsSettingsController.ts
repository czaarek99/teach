import { observable } from "mobx";
import { AccountDetailsModel } from "../../models/AccountDetailsModel";
import { LoadingButtonState } from "../../components";
import { ErrorModel } from "../../validation/ErrorModel";
import { IAccountDetailsModel } from "../../interfaces/models/IAccountDetailsModel";
import { IUserCache } from "../../util/UserCache";
import { IUserService } from "../../interfaces/services/IUserService";
import { ValidatorMap, validate } from "../../validation/validate";
import { password } from "../../validation/validators";

const validators : ValidatorMap<IAccountDetailsModel> = {
	newPassword: [
		password
	]
}

import {
	IAccountDetailsSettingsController,
	IAccountDetailsErrorState
} from "../../interfaces/controllers/settings/IAccountDetailsSettingsController";
import { ErrorMessage } from "common-library";
import { objectKeys } from "../../util/objectKeys";

export class AccountDetailsSettingsController implements IAccountDetailsSettingsController {

	private readonly userService: IUserService;
	private readonly userCache: IUserCache;
	private saveButtonStateTimeout?: number;

	@observable public model = new AccountDetailsModel();
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public email = "";
	@observable public loading = true;
	@observable public errorModel = new ErrorModel<IAccountDetailsErrorState>({
		password: [],
		repeatPassword: []
	});

	constructor(
		userService: IUserService,
		userCache: IUserCache
	) {
		this.userService = userService;
		this.userCache = userCache;
	}

	private validate(key: keyof IAccountDetailsModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];

			this.errorModel.setErrors(key, validate(value, keyValidators));
		}

		if(key === "repeatPassword") {
			const errors = [];

			if(this.model["newPassword"] !== this.model["repeatPassword"]) {
				errors.push(ErrorMessage.PASSWORDS_DONT_MATCH);
			}

			if(this.model["newPassword"] === this.email) {
				errors.push(ErrorMessage.PASSWORD_AND_EMAIL_SAME);
			}

			this.errorModel.setErrors("repeatPassword", errors)
		}
	}

	public async loadUserFromCache() : Promise<void> {
		const user = this.userCache.user;

		if(user)  {
			this.email = user.email;
		}
	}

	public async load() : Promise<void> {
		this.loading = false;
	}

	public onChange(key: keyof IAccountDetailsModel, value: string) : void {
		this.model[key]	= value;
	}

	public onSave = async() : Promise<void> => {
		clearTimeout(this.saveButtonStateTimeout);

		for(const key of objectKeys(this.model.toValidate())) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";
		}

	}
}