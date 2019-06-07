import { ILoginPageController, ILoginPageErrorState } from "../interfaces/controllers/ILoginPageController";
import { ILoginModel } from "../interfaces/models/ILoginModel";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { empty } from "../validation/validators";
import { ErrorModel } from "../validation/ErrorModel";
import { validate, ValidatorMap } from "../validation/validate";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { HttpError, ErrorMessage } from "common-library";
import { LoadingButtonState } from "../components/molecules/LoadingButton/LoadingButton";
import { RouterStore } from "mobx-react-router";
import { logIn } from "../util/logIn";

const validators : ValidatorMap<ILoginModel> = {
	email: [empty],
	password: [empty]
}

export class LoginPageController implements ILoginPageController {

	private readonly routingStore: RouterStore;
	private readonly authenticationService: IAuthenticationService;
	private shouldValidate = false;
	private isLoggedIn = false;

	@observable public loginButtonState: LoadingButtonState = "default";
	@observable public loading = false;
	@observable public model = new LoginModel();
	@observable public errorMessage: string | null = null;
	@observable public errorModel = new ErrorModel<ILoginPageErrorState>({
		email: [],
		password: []
	});

	constructor(authenticationService: IAuthenticationService, routingStore: RouterStore) {
		this.routingStore = routingStore;
		this.authenticationService = authenticationService;
	}

	public onChange(key: keyof ILoginModel, value: string) : void {
		if(this.isLoggedIn) {
			return;
		}

		this.model[key] = value;
		this.validate(key);
		this.loginButtonState = "default";
	}

	private validate(key: keyof ILoginModel) : void {
		if(this.shouldValidate) {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.model[key];

				this.errorModel.setErrors(key, validate(value, keyValidators))
			}
		}
	}

	public async onLogin() : Promise<void> {
		if(this.isLoggedIn) {
			return;
		}

		this.shouldValidate = true;

		for(const key of Object.keys(this.model.toJson())) {
			this.validate(key as (keyof ILoginModel));
		}

		if(!this.errorModel.hasErrors()) {
			this.loading = true;
			this.loginButtonState = "loading";

			try {
				await this.authenticationService.logIn(this.model);

				this.isLoggedIn = true;
				this.errorMessage = null;
				this.loginButtonState = "success";
				logIn(this.routingStore);
			} catch(error) {
				if(error instanceof HttpError) {
					this.errorMessage = error.error;
				} else {
					console.error(error);
					this.errorMessage = ErrorMessage.COMPONENT;
				}

				this.loginButtonState = "error";
			} finally {
				this.loading = false;
			}
		}
	}

}