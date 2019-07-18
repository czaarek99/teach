import { LoadingButtonState } from "../../../components";
import { ErrorState, ErrorModel } from "../../../validation";
import { IAddressModel } from "../../models";

export interface IAddressErrorState extends ErrorState {
	city: string[]
	zipCode: string[]
	street: string[]
	state: string[]
}

export interface IAddressProfileController {
	readonly viewModel: IAddressModel
	readonly errorModel: ErrorModel<IAddressErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly loading: boolean
	readonly showReset: boolean

	onChange: (key: keyof IAddressModel, value: any) => void
	onSave: () => Promise<void>
	onReset: () => void
}