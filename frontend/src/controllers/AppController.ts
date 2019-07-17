import { observable } from "mobx";
import { RootStore } from "../stores";
import { NavbarController } from "./templates";

import {
	IAppController,
	INavbarController,
	IProfilePageController,
	ISettingsPageController,
	ILoginPageController,
	IRegistrationPageController,
	IForgotPageController,
	IResetPasswordPageController,
	IBrowsePageController,
	IAdPageController,
	IMyAdsPageController,
	IEditAdPageController,
	IDMPageController,
	Route,
	DEFAULT_ROUTE,
} from "../interfaces";

import {
	LoginPageController,
	RegistrationPageController,
	ForgotPageController,
	ResetPasswordPageController,
	BrowsePageController,
	AdPageController,
	ProfilePageController,
	SettingsPageController,
	MyAdsPageController,
	EditAdPageController,
	DMPageController
} from "./pages";

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
