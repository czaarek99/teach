import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { IRegistrationModel } from "../../models/IRegistrationModel";
import { LoadingButtonState } from "../../../components/molecules/LoadingButton/LoadingButton";
import { OnFunctions } from "../../../components";

export interface IRegistrationPageErrorState extends ErrorState {
	email: string[]
	firstName: string[]
	lastName: string[]
	password: string[]
	repeatPassword: string[]
	captcha: string[]
	phoneNumber: string[]
	city: string[]
	zipCode: string[]
	street: string[]
	state: string[]
}

export interface IRegistrationPageController {
	readonly model: IRegistrationModel;
	readonly errorModel: ErrorModel<IRegistrationPageErrorState>
	readonly loading: boolean
	readonly errorMessage: string | null
	readonly registerButtonState: LoadingButtonState

	onFunctions: OnFunctions
	onChange: (key: keyof IRegistrationModel, value: any) => void
	onRegister: () => Promise<void>
}