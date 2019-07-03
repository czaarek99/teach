import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { ViewModel } from "../../ViewModel";
import { LoadingButtonState } from "../../../components";
import { IPersonalInformationModel } from "../../models/IPersonalInformationModel";

export interface IPersonalErrorState extends ErrorState {
	firstName: string[]
	lastName: string[]
	phoneNumber: string[]
}

export interface IPersonalInformationProfileController {
	readonly viewModel: ViewModel<IPersonalInformationModel>
	readonly errorModel: ErrorModel<IPersonalErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean

	onChange: (key: keyof IPersonalInformationModel, value: any) => void
	onSave: () => Promise<void>
	onReset: () => void
}