import { IResetPasswordModel } from "../../models/IResetPasswordModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";

export interface IResetPasswordPageErrorState extends ErrorState {
	password: string[]
	repeatPassword: string[]
}

export interface IResetPasswordPageController {
	readonly model: IResetPasswordModel
	readonly loading: boolean
	readonly errorModel: ErrorModel<IResetPasswordPageErrorState>;

	onChange: (key: keyof IResetPasswordModel, value: string) => void
}