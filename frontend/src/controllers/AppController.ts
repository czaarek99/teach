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
import { IEditAdPageController } from "../interfaces/controllers/pages/IEditAdPageController";
import { EditAdPageController } from "./pages/EditAdPageController";
import { RootStore } from "../stores/RootStore";
import { IDMPageController } from "../interfaces/controllers/pages/IDMPageController";
import { DMPageController } from "./pages/DMPageController";

export class AppController implements IAppController {

	@observable private readonly rootStore: RootStore;

	public readonly navbarController: INavbarController;

	private _profilePageController: IProfilePageController | null = null;
	private _settingsPageController: ISettingsPageController | null = null;

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
		return new LoginPageController(this.rootStore);
	}

	public get registrationPageController() : IRegistrationPageController {
		return new RegistrationPageController(this.rootStore);
	}

	public get forgotPageController() : IForgotPageController {
		return new ForgotPageController(this.rootStore);
	}

	public get resetPasswordPageController() : IResetPasswordPageController {
		return new ResetPasswordPageController(this.rootStore);
	}

	public get browsePageController() : IBrowsePageController {
		return new BrowsePageController(this.rootStore);
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
		return new MyAdsPageController(this.rootStore);
	}

	public get editAdPageController() : IEditAdPageController {
		return new EditAdPageController(this.rootStore);
	}

	public get dmPageController() : IDMPageController {
		return new DMPageController(this.rootStore);
	}
}
