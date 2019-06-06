import { ILoginPageController } from "./ILoginPageController";
import { IRegistrationPageController } from "./IRegistrationPageController";

export interface IAppController {
	readonly loginPageController: ILoginPageController;
	readonly registrationPageController: IRegistrationPageController;
}