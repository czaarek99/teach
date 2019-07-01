import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { IAddressModel } from "../../models/IAddressModel";
import { ViewModel } from "../../ViewModel";
import { LoadingButtonState } from "../../../components";

export interface IAddressErrorState extends ErrorState {
	city: string[]
	zipCode: string[]
	street: string[]
	state: string[]
}

export interface IAddressSettingsController {
	readonly viewModel: ViewModel<IAddressModel>
	readonly errorModel: ErrorModel<IAddressErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean

	onChange: (key: keyof IAddressModel, value: string) => void
	onSave: () => Promise<void>
	onReset: () => void
}