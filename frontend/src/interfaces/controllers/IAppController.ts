import { ILoginPageController } from "./ILoginPageController";
import { IRegistrationPageController } from "./IRegistrationPageController";
import { IForgotPageController } from "./IForgotPageController";

export interface IAppController {
	readonly loginPageController: ILoginPageController;
	readonly registrationPageController: IRegistrationPageController;
	readonly forgotPageController: IForgotPageController;
}