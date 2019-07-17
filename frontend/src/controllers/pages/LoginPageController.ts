import { ILoginPageController, ILoginPageErrorState } from "../../interfaces/controllers/pages/ILoginPageController";
import { ILoginModel } from "../../interfaces/models/ILoginModel";
import { observable, action } from "mobx";
import { LoginModel } from "../../models/LoginModel";
import { empty } from "../../validation/validators";
import { ErrorModel } from "../../validation/ErrorModel";
import { validate, ValidatorMap } from "../../validation/validate";
import { HttpError, ErrorMessage } from "common-library";
import { LoadingButtonState } from "../../components/molecules/LoadingButton/LoadingButton";
import { logIn } from "../../util/logIn";
import { objectKeys } from "../../util/objectKeys";
import { Route } from "../../interfaces/Route";
import { RootStore } from "../../stores/RootStore";
import { requireNoLogin } from "../../util/requireNoLogin";

const validators : ValidatorMap<ILoginModel> = {
	email: [empty],
	password: [empty]
}

export class LoginPageController implements ILoginPageController {

	@observable private readonly rootStore: RootStore;

	private shouldValidate = false;

	@observable public isLoggedIn = false;
	@observable public loginButtonState: LoadingButtonState = "default";
	@observable public loading = true;
	@observable public model = new LoginModel();
	@observable public errorMessage: string | null = null;
	@observable public errorModel = new ErrorModel<ILoginPageErrorState>({
		email: [],
		password: []
	});

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const canLoadPage = await requireNoLogin(this.rootStore);
		if(!canLoadPage) {
			return;
		}

		this.loading = false;
	}

	@action
	public onChange(key: keyof ILoginModel, value: string) : void {
		if(this.isLoggedIn) {
			return;
		}

		this.model[key] = value;
		this.validate(key);
		this.loginButtonState = "default";
	}

	@action
	private validate(key: keyof ILoginModel) : void {
		if(this.shouldValidate) {
			const keyValidators = validators[key];

			if(keyValidators !== undefined) {
				const value = this.model[key];

				this.errorModel.setErrors(key, validate(value, keyValidators))
			}
		}
	}

	@action
	public async onLogin() : Promise<void> {
		if(this.isLoggedIn) {
			return;
		}

		this.shouldValidate = true;

		for(const key of objectKeys(this.model.toInput())) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.loginButtonState = "error";
		} else {
			this.loading = true;
			this.loginButtonState = "loading";

			try {
				const response = await this.rootStore.services.authenticationService.logIn(
					this.model.toInput()
				);

				this.isLoggedIn = true;
				this.errorMessage = null;
				this.loginButtonState = "success";

				await logIn(this.rootStore, response);
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

	@action
	public goToRoute(route: Route) : void {
		this.rootStore.routingStore.push(route);
	}

	@action
	public onKeyDown = (event: KeyboardEvent) : void => {
		if(event.key === "Enter") {
			this.onLogin();
		}
	}
}