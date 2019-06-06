import { ILoginPageController, ILoginPageErrorState } from "../interfaces/controllers/ILoginPageController";
import { ILoginModel } from "../interfaces/models/ILoginModel";
import { observable } from "mobx";
import { LoginModel } from "../models/LoginModel";
import { empty } from "../validation/validators";
import { ErrorModel } from "../validation/ErrorModel";
import { validate, ValidatorMap } from "../validation/validate";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { HttpError } from "common-library";
import { LoadingButtonState } from "../components/molecules/LoadingButton/LoadingButton";

const validators : ValidatorMap<ILoginModel> = {
	email: [empty],
	password: [empty]
}

export class LoginPageController implements ILoginPageController {

	private readonly authenticationService: IAuthenticationService;

	@observable public loginButtonState: LoadingButtonState = "default";
	@observable public loading = false;
	@observable public model = new LoginModel();
	@observable public errorMessage: string | null = null;
	@observable public errorModel = new ErrorModel<ILoginPageErrorState>({
		email: [],
		password: []
	});

	constructor(authenticationService: IAuthenticationService) {
		this.authenticationService = authenticationService;
	}

	public onChange(key: keyof ILoginModel, value: string) : void {
		this.model[key] = value;
		this.validate(key);
		this.loginButtonState = "default";
	}

	private validate(key: keyof ILoginModel) : void {
		if(key in validators) {
			const value = this.model[key];
			const keyValidators = validators[key];

			this.errorModel.setErrors(key, validate(value, keyValidators))
		}
	}

	public async onLogin() : Promise<void> {
		for(const key of Object.keys(this.model.toJson())) {
			this.validate(key as (keyof ILoginModel));
		}

		if(!this.errorModel.hasErrors()) {
			this.loading = true;
			this.loginButtonState = "loading";

			try {
				await this.authenticationService.logIn(this.model);
				this.loginButtonState = "success";

				setTimeout(() => {
					//TODO: Redirect to  logged in page
					console.log("logged in!")
				}, 1000)
			} catch(error) {
				const typedError = error as HttpError;
				this.errorMessage = typedError.error;
				this.loginButtonState = "error";
			}

			this.loading = false;
		}
	}

}