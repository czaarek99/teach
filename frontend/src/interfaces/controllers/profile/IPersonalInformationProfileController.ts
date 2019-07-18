import { LoadingButtonState } from "../../../components";
import { ErrorState, ErrorModel } from "../../../validation";
import { IPersonalInformationModel } from "../../models";

export interface IPersonalErrorState extends ErrorState {
	firstName: string[]
	lastName: string[]
	phoneNumber: string[]
}

export interface IPersonalInformationProfileController {
	readonly viewModel: IPersonalInformationModel;
	readonly errorModel: ErrorModel<IPersonalErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean
	readonly showReset: boolean

	onChange: (key: keyof IPersonalInformationModel, value: any) => void
	onSave: () => Promise<void>
	onReset: () => void
}