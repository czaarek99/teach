import { observable } from "mobx";
import { ForgotModel } from "../../models/ForgotModel";
import { IForgotModel } from "../../interfaces/models/IForgotModel";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { LoadingButtonState, InfoBoxType, IRecaptchaFunctions } from "../../components";
import { ErrorModel } from "../../validation/ErrorModel";
import { ValidatorMap, validate } from "../../validation/validate";
import { email, notSet } from "../../validation/validators";
import { objectKeys } from "../../util/objectKeys";
import { HttpError } from "common-library";
import { ErrorMessage } from "common-library";

import {
	IForgotPageController,
	IForgotPageErrorState
} from "../../interfaces/controllers/pages/IForgotPageController";

const validators : ValidatorMap<IForgotModel> = {
	email: [email],
	captcha: [notSet]
}

export class ForgotPageController implements IForgotPageController {

	private readonly authenticationService: IAuthenticationService;
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

	constructor(authenticationService: IAuthenticationService) {
		this.authenticationService = authenticationService;
	}

	private validate(key: keyof IForgotModel) {
		const keyValidators = validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];

			this.errorModel.setErrors(key, validate(value, keyValidators))
		}
	}

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

	public async onSubmit() : Promise<void> {
		if(!this.done) {
			for(const key of objectKeys(this.model.toInput())) {
				this.validate(key);
			}

			if(!this.errorModel.hasErrors()) {
				this.loading = true;

				try {
					await this.authenticationService.forgot(this.model.toInput());

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