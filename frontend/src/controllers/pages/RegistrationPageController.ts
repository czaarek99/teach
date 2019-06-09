import { observable } from "mobx";
import { RegistrationModel } from "../../models/RegistrationModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { AddressModel } from "../../models/AddressModel";
import { LoadingButtonState } from "../../components/molecules/LoadingButton/LoadingButton";
import { IRegistrationModel } from "../../interfaces/models/IRegistrationModel";
import { IAddressModel } from "../../interfaces/models/IAddressModel";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { ValidatorMap, validate } from "../../validation/validate";
import { email, minLength, maxLength, password, notSet } from "../../validation/validators";
import { RouterStore } from "mobx-react-router";
import { logIn } from "../../util/logIn";
import { objectKeys } from "../../util/objectKeys";
import { IRecaptchaFunctions } from "../../components";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	STATE_MAX_LENGTH,
	HttpError,
	ErrorMessage,
	PHONE_NUMBER_MAX_LENGTH
} from "common-library";

import {
	IRegistrationPageController,
	IRegistrationPageErrorState,
	IAddressErrorState
} from "../../interfaces/controllers/pages/IRegistrationPageController";

const validators : ValidatorMap<IRegistrationModel> = {
	email: [
		email
	],
	firstName: [
		minLength(FIRST_NAME_MIN_LENGTH),
		maxLength(FIRST_NAME_MAX_LENGTH)
	],
	lastName: [
		minLength(LAST_NAME_MIN_LENGTH),
		maxLength(LAST_NAME_MAX_LENGTH)
	],
	password: [
		password
	],
	captcha: [
		notSet
	],
	phoneNumber: [
		maxLength(PHONE_NUMBER_MAX_LENGTH)
	]
}

const addressValidators : ValidatorMap<IAddressModel> = {
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

export class RegistrationPageController implements IRegistrationPageController {

	private readonly routingStore: RouterStore;
	private readonly authenticationService: IAuthenticationService;
	private shouldValidate = false;
	private shouldValidatePassword = false;
	private isLoggedIn = false;
	private captchaFunctions?: IRecaptchaFunctions;

	@observable public registrationModel = new RegistrationModel();
	@observable public addressModel = new AddressModel();
	@observable public loading = false;
	@observable public errorMessage : string | null = null;
	@observable public registerButtonState: LoadingButtonState = "default";

	@observable public registrationErrorModel = new ErrorModel<IRegistrationPageErrorState>({
		email: [],
		password: [],
		repeatPassword: [],
		firstName: [],
		lastName: [],
		captcha: [],
		phoneNumber: []
	});

	@observable public addressErrorModel = new ErrorModel<IAddressErrorState>({
		city: [],
		zipCode: [],
		street: [],
		state: []
	});

	constructor(authenticationService: IAuthenticationService, routingStore: RouterStore) {
		this.routingStore = routingStore;
		this.authenticationService = authenticationService;
	}

	private validate(key: keyof IRegistrationModel) : void {
		if(this.shouldValidate || (key === "password" && this.shouldValidatePassword)) {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.registrationModel[key as (keyof RegistrationModel)];

				this.registrationErrorModel.setErrors(key, validate(value, keyValidators));
			}
		}
	}

	private validateAddress(key: keyof IAddressModel) : void {
		if(this.shouldValidate) {
			const keyValidators = addressValidators[key];

			if(keyValidators !== undefined) {
				const value = this.addressModel[key];

				this.addressErrorModel.setErrors(key, validate(value, keyValidators));
			}
		}
	}

	public onChange(key: keyof IRegistrationModel, value: any) : void {
		if(this.isLoggedIn) {
			return;
		}

		this.registrationModel[key as (keyof RegistrationModel)] = value;

		if(key === "password") {
			this.shouldValidatePassword = true;
		}

		this.validate(key);

		if(this.shouldValidatePassword &&
			this.registrationModel.password !== this.registrationModel.repeatPassword &&
			(key === "repeatPassword" || key === "password")) {

			this.registrationErrorModel.setErrors("repeatPassword", [
				ErrorMessage.PASSWORDS_DONT_MATCH
			]);
		} else {
			this.registrationErrorModel.setErrors("repeatPassword", []);
		}
	}

	public onAddressChange(key: keyof IAddressModel, value: string) : void {
		if(this.isLoggedIn) {
			return;
		}

		this.addressModel[key] = value;
		this.validateAddress(key);
	}

	public onFunctions(functions: IRecaptchaFunctions) : void {
		this.captchaFunctions = functions;
	}

	public async onRegister() : Promise<void> {
		if(this.isLoggedIn) {
			return;
		}

		this.shouldValidate = true;

		for(const key of objectKeys(this.registrationModel.toJson())) {
			this.validate(key);
		}

		for(const key of objectKeys(this.addressModel.toJson())) {
			this.validateAddress(key);
		}

		if(this.registrationModel.password === this.registrationModel.email) {
			this.registrationErrorModel.setErrors("password", [
				ErrorMessage.PASSWORD_AND_EMAIL_SAME
			]);

			this.registrationErrorModel.setErrors("email", [
				ErrorMessage.PASSWORD_AND_EMAIL_SAME
			]);
		}

		if(!this.registrationErrorModel.hasErrors() && !this.addressErrorModel.hasErrors()) {
			this.loading = true;

			try  {
				const toSend = {
					...this.registrationModel.toJson(),
					address: this.addressModel.toJson()
				};

				await this.authenticationService.register(toSend);

				this.errorMessage = null;
				this.registerButtonState = "success";
				logIn(this.routingStore);
			} catch(error) {
				this.registrationModel.captcha = null;

				if(this.captchaFunctions) {
					this.captchaFunctions.reset();
				}

				if(error instanceof HttpError) {
					this.errorMessage = error.error;
				} else {
					console.error(error);
					this.errorMessage = ErrorMessage.COMPONENT;
				}

				this.registerButtonState = "error";
			} finally {
				this.loading = false;
			}
		}
	}

}