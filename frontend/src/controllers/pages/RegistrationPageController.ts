import { observable, action } from "mobx";
import { RegistrationModel } from "../../models/RegistrationModel";
import { ErrorModel } from "../../validation/ErrorModel";
import { LoadingButtonState } from "../../components/molecules/LoadingButton/LoadingButton";
import { IRegistrationModel } from "../../interfaces/models/IRegistrationModel";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { ValidatorMap, validate } from "../../validation/validate";
import { email, minLength, maxLength, password, notSet } from "../../validation/validators";
import { RouterStore } from "mobx-react-router";
import { logIn } from "../../util/logIn";
import { objectKeys } from "../../util/objectKeys";
import { IUserCache } from "../../util/UserCache";
import { IRecaptchaFunctions } from "../../components";
import { Route } from "../../interfaces/Routes";

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
	],

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
	private readonly userCache: IUserCache;

	private shouldValidate = false;
	private shouldValidatePassword = false;
	private isLoggedIn = false;
	private captchaFunctions?: IRecaptchaFunctions;

	@observable public model = new RegistrationModel();
	@observable public loading = true;
	@observable public errorMessage : string | null = null;
	@observable public registerButtonState: LoadingButtonState = "default";

	@observable public errorModel = new ErrorModel<IRegistrationPageErrorState>({
		email: [],
		firstName: [],
		lastName: [],
		password: [],
		repeatPassword: [],
		captcha: [],
		phoneNumber: [],
		city: [],
		zipCode: [],
		street: [],
		state: []
	});

	constructor(
		authenticationService: IAuthenticationService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.routingStore = routingStore;
		this.authenticationService = authenticationService;
		this.userCache = userCache;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		await this.userCache.recache();

		if(this.userCache.isLoggedIn) {
			this.routingStore.push(Route.BROWSE);
		}

		this.loading = false;
	}

	@action
	private validate(key: keyof IRegistrationModel) : void {
		if(this.shouldValidate || (key === "password" && this.shouldValidatePassword)) {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.model[key];

				this.errorModel.setErrors(key, validate(value, keyValidators));
			}
		}
	}

	@action
	public onChange(key: keyof IRegistrationModel, value: any) : void {
		if(this.isLoggedIn) {
			return;
		}

		this.model[key] = value;

		if(key === "password") {
			this.shouldValidatePassword = true;
		}

		this.validate(key);

		if(this.shouldValidatePassword &&
			this.model.password !== this.model.repeatPassword &&
			(key === "repeatPassword" || key === "password")) {

			this.errorModel.setErrors("repeatPassword", [
				ErrorMessage.PASSWORDS_DONT_MATCH
			]);
		} else {
			this.errorModel.setErrors("repeatPassword", []);
		}
	}

	@action
	public onFunctions = (functions: IRecaptchaFunctions) : void => {
		this.captchaFunctions = functions;
	}

	@action
	public async onRegister() : Promise<void> {
		if(this.isLoggedIn) {
			return;
		}

		this.shouldValidate = true;

		for(const key of objectKeys(this.model.toValidate())) {
			this.validate(key);
		}

		if(this.model.password === this.model.email) {
			this.errorModel.setErrors("password", [
				ErrorMessage.PASSWORD_AND_EMAIL_SAME
			]);

			this.errorModel.setErrors("email", [
				ErrorMessage.PASSWORD_AND_EMAIL_SAME
			]);
		}

		if(this.errorModel.hasErrors()) {
			this.registerButtonState = "error";
		} else {
			this.loading = true;

			try  {
				const response = await this.authenticationService.register(this.model.toJson());

				this.errorMessage = null;
				this.registerButtonState = "success";
				await logIn(this.routingStore, response, this.userCache);
			} catch(error) {
				this.model.captcha = null;

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