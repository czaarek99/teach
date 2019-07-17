import { observable, action } from "mobx";
import { ErrorMessage, HttpError } from "common-library";
import { RootStore } from "../../stores";
import { AccountDetailsModel } from "../../models";
import { LoadingButtonState } from "../../components";
import { successTimeout, objectKeys } from "../../util";

import {
	IAccountDetailsModel,
	IAccountDetailsProfileController,
	IAccountDetailsErrorState
} from "../../interfaces";

import {
	ValidatorMap,
	password,
	ErrorModel,
	validate
} from "../../validation";

const validators : ValidatorMap<IAccountDetailsModel> = {
	newPassword: [
		password
	]
}

export class AccountDetailsProfileController implements IAccountDetailsProfileController {

	@observable private readonly rootStore: RootStore;
	private saveButtonStateTimeout?: number;

	@observable private justChangedPassword = false;
	@observable public errorMessage = "";
	@observable public model = new AccountDetailsModel();
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public email = "";
	@observable public loading = true;
	@observable public isChangingPassword = false;
	@observable public errorModel = new ErrorModel<IAccountDetailsErrorState>({
		password: [],
		repeatPassword: []
	});

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	@action
	private validate(key: keyof IAccountDetailsModel) : void {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];

			this.errorModel.setErrors(key, validate(value, keyValidators));
		}

		if(key === "newPassword" || key === "repeatPassword") {
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

	@action
	public async loadUserFromCache() : Promise<void> {
		const user = this.rootStore.userCache.user;

		if(user)  {
			this.email = user.email;
		}
	}

	@action
	public async load() : Promise<void> {
		this.loading = false;
	}

	@action
	public onChange(key: keyof IAccountDetailsModel, value: string) : void {
		this.model[key]	= value;
		this.validate(key);
	}

	@action
	public changePassword() : void {
		this.isChangingPassword = true;
	}

	@action
	public cancelChangePassword() {
		this.isChangingPassword = false;
	}

	@action
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
					await this.rootStore.services.userService.updatePassword(input);
					this.saveButtonState = "success";
					this.justChangedPassword = true;
					this.errorMessage = "";

					this.saveButtonStateTimeout = successTimeout(() => {
						this.model = new AccountDetailsModel();

						this.saveButtonState = "default";
						this.isChangingPassword = false;
						this.justChangedPassword = false;
					});
				} catch(error) {
					if(error instanceof HttpError) {
						this.errorMessage = error.error;
					} else {
						console.error(error);
						this.errorMessage = ErrorMessage.COMPONENT;
					}

					this.saveButtonState = "error";
				}
			}
		}
	}
}