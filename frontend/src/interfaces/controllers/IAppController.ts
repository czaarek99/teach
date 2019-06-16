import { ILoginPageController } from "./pages/ILoginPageController";
import { IRegistrationPageController } from "./pages/IRegistrationPageController";
import { IForgotPageController } from "./pages/IForgotPageController";
import { IResetPasswordPageController } from "./pages/IResetPasswordPageController";
import { IBrowsePageController } from "./pages/IBrowsePageController";

export interface IAppController {
	readonly loginPageController: ILoginPageController
	readonly registrationPageController: IRegistrationPageController
	readonly forgotPageController: IForgotPageController
	readonly resetPasswordPageController: IResetPasswordPageController
	readonly browsePageController: IBrowsePageController
}