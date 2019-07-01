import { observable } from "mobx";
import { AccountDetailsModel } from "../../models/AccountDetailsModel";
import { LoadingButtonState } from "../../components";
import { ErrorModel } from "../../validation/ErrorModel";
import { IAccountDetailsModel } from "../../interfaces/models/IAccountDetailsModel";
import { IUserCache } from "../../util/UserCache";
import { IUserService } from "../../interfaces/services/IUserService";
import { ValidatorMap, validate } from "../../validation/validate";
import { password } from "../../validation/validators";
import { ErrorMessage } from "common-library";
import { objectKeys } from "../../util/objectKeys";

import {
	IAccountDetailsSettingsController,
	IAccountDetailsErrorState
} from "../../interfaces/controllers/settings/IAccountDetailsSettingsController";

const validators : ValidatorMap<IAccountDetailsModel> = {
	newPassword: [
		password
	]
}

export class AccountDetailsSettingsController implements IAccountDetailsSettingsController {

	private readonly userCache: IUserCache;
	private readonly userService: IUserService;
	private saveButtonStateTimeout?: number;

	@observable private justChangedPassword = false;
	@observable public model = new AccountDetailsModel();
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public email = "";
	@observable public loading = true;
	@observable public isChangingPassword = false;
	@observable public errorModel = new ErrorModel<IAccountDetailsErrorState>({
		password: [],
		repeatPassword: []
	});

	constructor(
		userCache: IUserCache,
		userService: IUserService,
	) {
		this.userCache = userCache;
		this.userService = userService;
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

		this.validate(key);
	}

	public changePassword() : void {
		this.isChangingPassword = true;
	}

	public cancelChangePassword() {
		this.isChangingPassword = false;
	}

	public onSave = async() : Promise<void> => {
		if(!this.justChangedPassword) {
			clearTimeout(this.saveButtonStateTimeout);

			for(const key of objectKeys(this.model.toValidate())) {
				this.validate(key);
			}

			if(this.errorModel.hasErrors()) {
				this.saveButtonState = "error";
			} else {
				this.saveButtonState = "loading";

				const input = this.model.toInput();

				try {
					await this.userService.updatePassword(input);
					this.saveButtonState = "success";
					this.justChangedPassword = true;

					this.saveButtonStateTimeout = window.setTimeout(() => {
						this.model = new AccountDetailsModel();

						this.saveButtonState = "default";
						this.isChangingPassword = false;
						this.justChangedPassword = false;
					});
				} catch(error) {
					this.saveButtonState = "error";
				}
			}
		}
	}
}