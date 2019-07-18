import { INavbarController } from "./templates";

import {
	ILoginPageController,
	IRegistrationPageController,
	IForgotPageController,
	IResetPasswordPageController,
	IBrowsePageController,
	IAdPageController,
	IProfilePageController,
	ISettingsPageController,
	IMyAdsPageController,
	IEditAdPageController,
	IDMPageController
} from "./pages";

export interface IAppController {
	readonly navbarController: INavbarController
	readonly loginPageController: ILoginPageController
	readonly registrationPageController: IRegistrationPageController
	readonly forgotPageController: IForgotPageController
	readonly resetPasswordPageController: IResetPasswordPageController
	readonly browsePageController: IBrowsePageController
	readonly adPageController: IAdPageController
	readonly profilePageController: IProfilePageController
	readonly settingsPageController: ISettingsPageController
	readonly myAdsPageController: IMyAdsPageController
	readonly editAdPageController: IEditAdPageController
	readonly dmPageController: IDMPageController
}