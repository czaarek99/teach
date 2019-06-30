import { IAccountModel } from "../../models/IAccountModel";
import { IAddressModel } from "../../models/IAddressModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { ViewModel } from "../../ViewModel";

export interface IAccountErrorState extends ErrorState {
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
	readonly accountViewModel: ViewModel<IAccountModel>
	readonly accountErrorModel: ErrorModel<IAccountErrorState>

	readonly addressViewModel: ViewModel<IAddressModel>
	readonly addressErrorModel: ErrorModel<IAddressErrorState>
	readonly loading: boolean

	onAccountChange: (key: keyof IAccountModel, value: any) => void
	onAccountSave: () => Promise<void>
	onAccountReset: () => void

	onAddressChange: (key: keyof IAddressModel, value: string) => void
	onAddressSave: () => Promise<void>
	onAddressReset: () => void
}