import { IAppController } from "../interfaces/controllers/IAppController";
import { ILoginPageController } from "../interfaces/controllers/ILoginPageController";
import { LoginPageController } from "./LoginPageController";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { AuthenticationService } from "../services/AuthenticationService";
import { IRegistrationPageController } from "../interfaces/controllers/IRegistrationPageController";
import { RegistrationPageController } from "./RegistrationPageController";
import { RouterStore } from "mobx-react-router";

interface IServices {
	authenticationService: IAuthenticationService
}

export class AppController implements IAppController {

	private readonly routingStore: RouterStore;
	private readonly services: IServices;
	private _loginPageController: ILoginPageController | null = null;
	private _registrationPageController: IRegistrationPageController | null = null;

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;

		this.services = {
			authenticationService: new AuthenticationService()
		}
	}

	public get loginPageController() : ILoginPageController {
		if(this._loginPageController === null) {
			this._loginPageController = new LoginPageController(
				this.services.authenticationService,
				this.routingStore
			);
		}

		return this._loginPageController;
	}

	public get registrationPageController() : IRegistrationPageController {
		if(this._registrationPageController === null) {
			this._registrationPageController = new RegistrationPageController(
				this.services.authenticationService,
				this.routingStore
			);
		}

		return this._registrationPageController;
	}

}