import { IPersonalInformationModel } from "../../models/IPersonalInformationModel";
import { IAddressModel } from "../../models/IAddressModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { ViewModel } from "../../ViewModel";
import { LoadingButtonState } from "../../../components";

export interface IPersonalErrorState extends ErrorState {
	firstName: string[]
	lastName: string[]
	phoneNumber: string[]
}

export interface IAddressErrorState extends ErrorState {
	city: string[]
	zipCode: string[]
	street: string[]
	state: string[]
}

export interface ISettingsPageController {
	readonly personalViewModel: ViewModel<IPersonalInformationModel>
	readonly personalErrorModel: ErrorModel<IPersonalErrorState>
	readonly addressViewModel: ViewModel<IAddressModel>
	readonly addressErrorModel: ErrorModel<IAddressErrorState>
	readonly personalSaveButtonState: LoadingButtonState
	readonly addressSaveButtonState: LoadingButtonState
	readonly loading: boolean

	onPersonalChange: (key: keyof IPersonalInformationModel, value: any) => void
	onPersonalSave: () => Promise<void>
	onPersonalReset: () => void

	onAddressChange: (key: keyof IAddressModel, value: string) => void
	onAddressSave: () => Promise<void>
	onAddressReset: () => void
}