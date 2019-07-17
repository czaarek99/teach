import { observable, action } from "mobx";
import { ErrorMessage, HttpError } from "common-library";
import { RootStore } from "../../stores";
import { ResetPasswordModel } from "../../models";
import { LoadingButtonState, InfoBoxType } from "../../components";
import { objectKeys } from "../../util";

import {
	IResetPasswordPageController,
	IResetPasswordModel,
	IResetPasswordPageErrorState
} from "../../interfaces";

import {
	ValidatorMap,
	password,
	uuid4,
	ErrorModel,
	ValidationResult,
	validate
} from "../../validation";

export class ResetPasswordPageController implements IResetPasswordPageController {

	private readonly rootStore: RootStore;
	private readonly validators : ValidatorMap<IResetPasswordModel> = {
		password: [
			password
		],
		resetKey: [
			uuid4
		],
		repeatPassword: [
			this.samePasswordValidator.bind(this)
		]
	}

	@observable public model = new ResetPasswordModel();
	@observable public disabled = false;
	@observable public resetPasswordButtonState : LoadingButtonState = "default";
	@observable public infoBoxMessage : string | null = null;
	@observable public infoBoxType : InfoBoxType = "default"
	@observable public errorModel = new ErrorModel<IResetPasswordPageErrorState>({
		password: [],
		repeatPassword: []
	});

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		const url = new URL(window.location.href);

		const resetKey = url.searchParams.get("resetKey");

		let resetKeyIsBad = false;

		if(resetKey) {
			this.model.resetKey = resetKey;

			if(uuid4(resetKey) !== null) {
				resetKeyIsBad = true;
			}

		} else {
			resetKeyIsBad = true;
		}

		if(resetKeyIsBad) {
			this.disabled = true;
			this.resetPasswordButtonState = "disabled";
			this.infoBoxType = "error";
			this.infoBoxMessage = ErrorMessage.BAD_RESET_KEY;
		}

	}

	@action
	private validate(key: keyof IResetPasswordModel) : void {
		const keyValidators = this.validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];

			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	private samePasswordValidator(repeatPassword: string) : ValidationResult {
		if(this.model.password !== repeatPassword) {
			return ErrorMessage.PASSWORDS_DONT_MATCH
		}

		return null;
	}

	@action
	public onChange(key: keyof IResetPasswordModel, value: string) : void {
		this.model[key] = value;
		this.validate(key);
	}

	@action
	public async onSubmit() : Promise<void> {

		if(!this.disabled) {
			for(const key of objectKeys(this.model.toValidate())) {
				this.validate(key);
			}

			if(!this.errorModel.hasErrors()) {
				this.disabled = true;
				this.resetPasswordButtonState = "loading";

				try {
					await this.rootStore.services.authenticationService.resetPassword(
						this.model.toInput()
					);

					this.infoBoxType = "success";
					this.infoBoxMessage = "actions.passwordIsReset";
					this.resetPasswordButtonState = "success";

					setTimeout(() => {
						this.resetPasswordButtonState = "disabled";
					}, 2000)
				} catch(error) {
					this.infoBoxType = "error";
					this.resetPasswordButtonState = "error";
					this.disabled = false;

					if(error instanceof HttpError) {
						this.infoBoxMessage = error.error;
					} else {
						console.error(error);
						this.infoBoxMessage = ErrorMessage.COMPONENT;
					}
				}
			}
		}
	}
}