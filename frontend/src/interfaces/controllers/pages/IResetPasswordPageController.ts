import { IResetPasswordModel } from "../../models/IResetPasswordModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { LoadingButtonState, InfoBoxType } from "../../../components";

export interface IResetPasswordPageErrorState extends ErrorState {
	password: string[]
	repeatPassword: string[]
}

export interface IResetPasswordPageController {
	readonly model: IResetPasswordModel
	readonly disabled: boolean
	readonly errorModel: ErrorModel<IResetPasswordPageErrorState>
	readonly resetPasswordButtonState: LoadingButtonState
	readonly infoBoxMessage: string | null;
	readonly infoBoxType: InfoBoxType

	onSubmit: () => Promise<void>
	onChange: (key: keyof IResetPasswordModel, value: string) => void
}