import { LoadingButtonState } from "../../../components";
import { ErrorState, ErrorModel } from "../../../validation";
import { IAccountDetailsModel } from "../../models";

export interface IAccountDetailsErrorState extends ErrorState {
	password: string[]
	repeatPassword: string[]
}

export interface IAccountDetailsProfileController {
	readonly model: IAccountDetailsModel
	readonly errorModel: ErrorModel<IAccountDetailsErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean
	readonly email: string
	readonly isChangingPassword: boolean
	readonly errorMessage: string

	changePassword: () => void
	cancelChangePassword: () => void
	onChange: (key: keyof IAccountDetailsModel, value: string) => void
	onSave: () => Promise<void>
}