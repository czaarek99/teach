import { IAccountModel } from "../../models/IAccountModel";
import { IAddressModel } from "../../models/IAddressModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";

export interface IAccountErrorState extends ErrorState {
	firstName: string[]
	lastName: string[]
	phoneNumber: string[]
}

export interface ISettingsPageController {
	readonly accountModel: IAccountModel
	readonly accountErrorModel: ErrorModel<IAccountErrorState>

	readonly addressModel: IAddressModel
	readonly loading: boolean

	onAccountChange: (key: keyof IAccountModel, value: any) => void
}