import { IAccountDetailsModel } from "../../models/IAccountDetailsModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { LoadingButtonState } from "../../../components";

export interface IAccountDetailsErrorState extends ErrorState {
	password: string[]
	repeatPassword: string[]
}

export interface IAccountDetailsSettingsController {
	readonly model: IAccountDetailsModel
	readonly errorModel: ErrorModel<IAccountDetailsErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean
	readonly email: string
	readonly isChangingPassword: boolean

	changePassword: () => void
	cancelChangePassword: () => void
	onChange: (key: keyof IAccountDetailsModel, value: string) => void
	onSave: () => Promise<void>
}