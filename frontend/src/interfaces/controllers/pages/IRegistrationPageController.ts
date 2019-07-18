import { OnFunctions, LoadingButtonState } from "../../../components";
import { ErrorState, ErrorModel } from "../../../validation";
import { IRegistrationModel } from "../../models";

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
	readonly model: IRegistrationModel
	readonly errorModel: ErrorModel<IRegistrationPageErrorState>
	readonly loading: boolean
	readonly errorMessage: string | null
	readonly registerButtonState: LoadingButtonState

	onFunctions: OnFunctions
	onChange: (key: keyof IRegistrationModel, value: any) => void
	onRegister: () => Promise<void>
}