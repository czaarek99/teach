import { observable } from "mobx";
import { IAppController } from "../interfaces/controllers/IAppController";
import { ILoginPageController } from "../interfaces/controllers/pages/ILoginPageController";
import { LoginPageController } from "./pages/LoginPageController";
import { IRegistrationPageController } from "../interfaces/controllers/pages/IRegistrationPageController";
import { RegistrationPageController } from "./pages/RegistrationPageController";
import { IForgotPageController } from "../interfaces/controllers/pages/IForgotPageController";
import { ForgotPageController } from "./pages/ForgotPageController";
import { Route, DEFAULT_ROUTE } from "../interfaces/Routes";
import { IResetPasswordPageController } from "../interfaces/controllers/pages/IResetPasswordPageController";
import { ResetPasswordPageController } from "./pages/ResetPasswordPageController";
import { IBrowsePageController } from "../interfaces/controllers/pages/IBrowsePageController";
import { BrowsePageController } from "./pages/BrowsePageController";
import { NavbarController } from "./templates/NavbarController";
import { INavbarController } from "../interfaces/controllers/templates/INavbarController";
import { IAdPageController } from "../interfaces/controllers/pages/IAdPageController";
import { AdPageController } from "./pages/AdPageController";
import { IProfilePageController } from "../interfaces/controllers/pages/IProfilePageController";
import { ProfilePageController } from "./pages/ProfilePageController";
import { ISettingsPageController } from "../interfaces/controllers/pages/ISettingsPageController";
import { SettingsPageController } from "./pages/SettingsPageController";
import { IMyAdsPageController } from "../interfaces/controllers/pages/IMyAdsPageController";
import { MyAdsPageController } from "./pages/MyAdsPageController";
import { IEditAdPageController } from "../interfaces/controllers/pages/INewAdPageController";
import { EditAdPageController } from "./pages/EditAdPageController";
import { RootStore } from "../stores/RootStore";

export class AppController implements IAppController {

	@observable private readonly rootStore: RootStore;

	public readonly navbarController: INavbarController;

	private _loginPageController: ILoginPageController | null = null;
	private _registrationPageController: IRegistrationPageController | null = null;
	private _forgotPageController: IForgotPageController | null = null;
	private _resetPasswordPageController: IResetPasswordPageController | null = null;
	private _browsePageController: IBrowsePageController | null = null;
	private _profilePageController: IProfilePageController | null = null;
	private _settingsPageController: ISettingsPageController | null = null;
	private _myAdsPageController: IMyAdsPageController | null = null;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.navbarController = new NavbarController(rootStore);

		const routes = Object.values(Route);
		const location = rootStore.routingStore.location;

		if(location && !routes.includes(location.pathname)) {
			rootStore.routingStore.push(DEFAULT_ROUTE);
		}
	}

	public get loginPageController() : ILoginPageController {
		if(this._loginPageController === null) {
			this._loginPageController = new LoginPageController(this.rootStore);
		}

		return this._loginPageController;
	}

	public get registrationPageController() : IRegistrationPageController {
		if(this._registrationPageController === null) {
			this._registrationPageController = new RegistrationPageController(this.rootStore);
		}

		return this._registrationPageController;
	}

	public get forgotPageController() : IForgotPageController {
		if(this._forgotPageController === null) {
			this._forgotPageController = new ForgotPageController(this.rootStore);
		}

		return this._forgotPageController;
	}

	public get resetPasswordPageController() : IResetPasswordPageController {
		if(this._resetPasswordPageController === null) {
			this._resetPasswordPageController = new ResetPasswordPageController(this.rootStore);
		}

		return this._resetPasswordPageController;
	}

	public get browsePageController() : IBrowsePageController {
		if(this._browsePageController === null) {
			this._browsePageController = new BrowsePageController(this.rootStore);
		}

		return this._browsePageController;
	}

	public get adPageController() : IAdPageController {
		return new AdPageController(this.rootStore);
	}

	public get profilePageController() : IProfilePageController {
		if(this._profilePageController === null) {
			this._profilePageController = new ProfilePageController(this.rootStore);
		}

		return this._profilePageController;
	}

	public get settingsPageController() : ISettingsPageController {
		if(this._settingsPageController === null) {
			this._settingsPageController = new SettingsPageController(this.rootStore);
		}

		return this._settingsPageController;
	}

	public get myAdsPageController() : IMyAdsPageController {
		if(this._myAdsPageController === null) {
			this._myAdsPageController = new MyAdsPageController(
				this.rootStore
			);
		}

		return this._myAdsPageController;
	}

	public get editAdPageController() : IEditAdPageController {
		return new EditAdPageController(this.rootStore);
	}
}
