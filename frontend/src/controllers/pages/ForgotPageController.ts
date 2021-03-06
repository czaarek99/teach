import { observable, action } from "mobx";
import { RootStore } from "../../stores";
import { ForgotModel } from "../../models";
import { objectKeys } from "../../util";
import { ErrorMessage, HttpError } from "common-library";

import {
	IRecaptchaFunctions,
	LoadingButtonState,
	InfoBoxType
} from "../../components";

import {
	ValidatorMap,
	email,
	notSet,
	ErrorModel,
	validate
} from "../../validation";

import {
	IForgotModel,
	IForgotPageController,
	IForgotPageErrorState
} from "../../interfaces";

const validators : ValidatorMap<IForgotModel> = {
	email: [email],
	captcha: [notSet]
}

export class ForgotPageController implements IForgotPageController {

	@observable private readonly rootStore: RootStore;
	private captchaFunctions?: IRecaptchaFunctions;

	@observable public model = new ForgotModel();
	@observable public loading = false;
	@observable public forgotButtonState : LoadingButtonState = "default";
	@observable public infoBoxType : InfoBoxType = "default";
	@observable public infoBoxMessage : string | null = null;
	@observable public done = false;

	@observable public errorModel = new ErrorModel<IForgotPageErrorState>({
		email: [],
		captcha: []
	})

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	@action
	private validate(key: keyof IForgotModel) {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];

			this.errorModel.setErrors(key, validate(value, keyValidators))
		}
	}

	@action
	public onChange(key: keyof IForgotModel, value: string | null) : void {
		if(key === "captcha") {
			this.model["captcha"] = value;
		} else if(value !== null) {
			this.model[key] = value;
		}

		this.validate(key);
	}

	public onFunctions(functions: IRecaptchaFunctions) : void {
		this.captchaFunctions = functions;
	}

	@action
	public async onSubmit() : Promise<void> {
		if(!this.done) {
			for(const key of objectKeys(this.model.toInput())) {
				this.validate(key);
			}

			if(!this.errorModel.hasErrors()) {
				this.loading = true;

				try {
					await this.rootStore.services.authenticationService.forgot(
						this.model.toInput()
					);

					this.infoBoxType = "success";
					this.forgotButtonState = "success";

					this.infoBoxMessage = "actions.resetEmailSent"
					this.done = true;

					setTimeout(() => {
						this.forgotButtonState = "disabled";
					}, 3000)
				} catch(error) {
					this.infoBoxType = "error";
					this.forgotButtonState = "error";

					if(this.captchaFunctions) {
						this.captchaFunctions.reset();
					}

					if(error instanceof HttpError) {
						this.infoBoxMessage = error.error;
					} else {
						console.error(error);
						this.infoBoxMessage = ErrorMessage.COMPONENT;
					}

				} finally {
					this.loading = false;
				}
			}
		}
	}
}