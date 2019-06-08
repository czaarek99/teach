import { IForgotModel } from "../../models/IForgotModel";
import { ErrorModel, ErrorState } from "../../../validation/ErrorModel";
import { LoadingButtonState, InfoBoxType, OnFunctions } from "../../../components";

export interface IForgotPageErrorState extends ErrorState {
	email: string[]
	captcha: string[]
}

export interface IForgotPageController {
	readonly model: IForgotModel
	readonly errorModel: ErrorModel<IForgotPageErrorState>
	readonly loading: boolean
	readonly forgotButtonState: LoadingButtonState
	readonly infoBoxMessage: string | null
	readonly infoBoxType: InfoBoxType
	readonly done: boolean

	onChange: (key: keyof IForgotModel, value: string | null) => void
	onSubmit: () => Promise<void>
	onFunctions: OnFunctions
}