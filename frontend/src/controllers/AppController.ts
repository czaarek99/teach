import { IAppController } from "../interfaces/controllers/IAppController";
import { ILoginPageController } from "../interfaces/controllers/pages/ILoginPageController";
import { LoginPageController } from "./pages/LoginPageController";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { AuthenticationService } from "../services/AuthenticationService";
import { IRegistrationPageController } from "../interfaces/controllers/pages/IRegistrationPageController";
import { RegistrationPageController } from "./pages/RegistrationPageController";
import { RouterStore } from "mobx-react-router";
import { IForgotPageController } from "../interfaces/controllers/pages/IForgotPageController";
import { ForgotPageController } from "./pages/ForgotPageController";
import { observable } from "mobx";
import { Route, DEFAULT_ROUTE } from "../interfaces/Routes";
import { IResetPasswordPageController } from "../interfaces/controllers/pages/IResetPasswordPageController";
import { ResetPasswordPageController } from "./pages/ResetPasswordPageController";
import { IAdService } from "../interfaces/services/IAdService";
import { AdService } from "../services/AdService";
import { IBrowsePageController } from "../interfaces/controllers/pages/IBrowsePageController";
import { BrowsePageController } from "./pages/BrowsePageController";
import { NavbarController } from "./templates/NavbarController";
import { INavbarController } from "../interfaces/controllers/templates/INavbarController";
import { IUserService } from "../interfaces/services/IUserService";
import { UserService } from "../services/UserService";
import { IUserCache, UserCache } from "../util/UserCache";
import { IAdPageController } from "../interfaces/controllers/pages/IAdPageController";
import { AdPageController } from "./pages/AdPageController";
import { IProfilePageController } from "../interfaces/controllers/pages/IProfilePageController";
import { ProfilePageController } from "./pages/ProfilePageController";
import { ISettingsService } from "../interfaces/services/ISettingsService";
import { SettingsService } from "../services/SettingsService";
import { ISettingsPageController } from "../interfaces/controllers/pages/ISettingsPageController";
import { SettingsPageController } from "./pages/SettingsPageController";

interface IServices {
	authenticationService: IAuthenticationService
	userService: IUserService
	adService: IAdService
	settingsService: ISettingsService
}

export class AppController implements IAppController {

	public readonly navbarController: INavbarController;

	private readonly routingStore: RouterStore;
	private readonly services: IServices;

	@observable private readonly userCache: IUserCache;
	private _loginPageController: ILoginPageController | null = null;
	private _registrationPageController: IRegistrationPageController | null = null;
	private _forgotPageController: IForgotPageController | null = null;
	private _resetPasswordPageController: IResetPasswordPageController | null = null;
	private _browsePageController: IBrowsePageController | null = null;
	private _adPageController: IAdPageController | null = null;
	private _profilePageController: IProfilePageController | null = null;
	private _settingsPageController: ISettingsPageController | null = null;

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;

		this.services = {
			settingsService: new SettingsService(),
			authenticationService: new AuthenticationService(),
			userService: new UserService(),
			adService: new AdService()
		};

		this.userCache = new UserCache(this.services.userService);

		this.navbarController = new NavbarController(
			routingStore,
			this.userCache,
			this.services.authenticationService
		);


		const routes = Object.values(Route);
		if(!routes.includes(routingStore.location.pathname)) {
			routingStore.push(DEFAULT_ROUTE);
		}
	}

	public get loginPageController() : ILoginPageController {
		if(this._loginPageController === null) {
			this._loginPageController = new LoginPageController(
				this.services.authenticationService,
				this.routingStore,
				this.userCache
			);
		}

		return this._loginPageController;
	}

	public get registrationPageController() : IRegistrationPageController {
		if(this._registrationPageController === null) {
			this._registrationPageController = new RegistrationPageController(
				this.services.authenticationService,
				this.routingStore,
				this.userCache
			);
		}

		return this._registrationPageController;
	}

	public get forgotPageController() : IForgotPageController {
		if(this._forgotPageController === null) {
			this._forgotPageController = new ForgotPageController(
				this.services.authenticationService
			);
		}

		return this._forgotPageController;
	}

	public get resetPasswordPageController() : IResetPasswordPageController {
		if(this._resetPasswordPageController === null) {
			this._resetPasswordPageController = new ResetPasswordPageController(
				this.services.authenticationService
			);
		}

		return this._resetPasswordPageController;
	}

	public get browsePageController() : IBrowsePageController {
		if(this._browsePageController === null) {
			this._browsePageController = new BrowsePageController(
				this.services.adService,
				this.routingStore
			);
		}

		return this._browsePageController;
	}

	public get adPageController() : IAdPageController {
		if(this._adPageController === null) {
			this._adPageController = new AdPageController(
				this.services.adService,
				this.routingStore
			);
		}

		return this._adPageController;
	}

	public get profilePageController() : IProfilePageController {
		if(this._profilePageController === null) {
			this._profilePageController = new ProfilePageController(
				this.services.userService,
				this.routingStore,
				this.userCache
			);
		}

		return this._profilePageController;
	}

	public get settingsPageController() : ISettingsPageController {
		if(this._settingsPageController === null) {
			this._settingsPageController = new SettingsPageController();
		}

		return this._settingsPageController;
	}

}
