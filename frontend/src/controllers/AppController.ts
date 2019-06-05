import { IAppController } from "../interfaces/controllers/IAppController";
import { ILoginPageController } from "../interfaces/controllers/ILoginPageController";
import { LoginPageController } from "./LoginPageController";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { AuthenticationService } from "../services/AuthenticationService";

interface IServices {
	authenticationService: IAuthenticationService
}

export class AppController implements IAppController {

	private readonly services: IServices;
	private _loginPageController: ILoginPageController | null = null;

	constructor() {
		this.services = {
			authenticationService: new AuthenticationService()
		}
	}

	public get loginPageController() : ILoginPageController {
		if(this._loginPageController === null) {
			this._loginPageController = new LoginPageController(this.services.authenticationService);
		}

		return this._loginPageController;
	}

}