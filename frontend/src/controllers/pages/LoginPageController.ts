import { ILoginPageController, ILoginPageErrorState } from "../../interfaces/controllers/pages/ILoginPageController";
import { ILoginModel } from "../../interfaces/models/ILoginModel";
import { observable } from "mobx";
import { LoginModel } from "../../models/LoginModel";
import { empty } from "../../validation/validators";
import { ErrorModel } from "../../validation/ErrorModel";
import { validate, ValidatorMap } from "../../validation/validate";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { HttpError, ErrorMessage } from "common-library";
import { LoadingButtonState } from "../../components/molecules/LoadingButton/LoadingButton";
import { RouterStore } from "mobx-react-router";
import { logIn } from "../../util/logIn";
import { objectKeys } from "../../util/objectKeys";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";

const validators : ValidatorMap<ILoginModel> = {
	email: [empty],
	password: [empty]
}

export class LoginPageController implements ILoginPageController {

	private readonly routingStore: RouterStore;
	private readonly authenticationService: IAuthenticationService;
	private readonly userCache: IUserCache;

	private shouldValidate = false;
	private isLoggedIn = false;

	@observable public loginButtonState: LoadingButtonState = "default";
	@observable public loading = true;
	@observable public model = new LoginModel();
	@observable public errorMessage: string | null = null;
	@observable public errorModel = new ErrorModel<ILoginPageErrorState>({
		email: [],
		password: []
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

	private async load() : Promise<void> {
		await this.userCache.recache();

		if(this.userCache.isLoggedIn) {
			this.routingStore.push(Route.BROWSE);
		}

		this.loading = false;
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

		for(const key of objectKeys(this.model.toInput())) {
			this.validate(key as (keyof ILoginModel));
		}

		if(this.errorModel.hasErrors()) {
			this.loginButtonState = "error";
		} else {
			this.loading = true;
			this.loginButtonState = "loading";

			try {
				const response = await this.authenticationService.logIn(this.model.toInput());

				this.isLoggedIn = true;
				this.errorMessage = null;
				this.loginButtonState = "success";

				await logIn(this.routingStore, response, this.userCache);
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