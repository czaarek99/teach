import { IAppController } from "../interfaces/controllers/IAppController";
import { ILoginPageController } from "../interfaces/controllers/ILoginPageController";
import { LoginPageController } from "./LoginPageController";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { AuthenticationService } from "../services/AuthenticationService";
import { IRegistrationPageController } from "../interfaces/controllers/IRegistrationPageController";
import { RegistrationPageController } from "./RegistrationPageController";
import { RouterStore } from "mobx-react-router";
import { IForgotPageController } from "../interfaces/controllers/IForgotPageController";
import { ForgotPageController } from "./ForgotPageController";
import { observable, computed } from "mobx";

interface IServices {
	authenticationService: IAuthenticationService
}

export class AppController implements IAppController {

	private readonly routingStore: RouterStore;
	private readonly services: IServices;

	@observable private _loginPageController: ILoginPageController | null = null;
	@observable private _registrationPageController: IRegistrationPageController | null = null;
	@observable private _forgotPageController: IForgotPageController | null = null;

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;

		this.services = {
			authenticationService: new AuthenticationService()
		}
	}

	@computed public get loginPageController() : ILoginPageController {
		if(this._loginPageController === null) {
			this._loginPageController = new LoginPageController(
				this.services.authenticationService,
				this.routingStore
			);
		}

		return this._loginPageController;
	}

	@computed public get registrationPageController() : IRegistrationPageController {
		if(this._registrationPageController === null) {
			this._registrationPageController = new RegistrationPageController(
				this.services.authenticationService,
				this.routingStore
			);
		}

		return this._registrationPageController;
	}

	@computed public get forgotPageController() : IForgotPageController {
		if(this._forgotPageController === null) {
			this._forgotPageController = new ForgotPageController(
				this.services.authenticationService
			);
		}

		return this._forgotPageController;
	}

}