import { LoadingButtonState, InfoBoxType } from "../../../components";
import { ErrorState, ErrorModel } from "../../../validation";
import { IResetPasswordModel } from "../../models";

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