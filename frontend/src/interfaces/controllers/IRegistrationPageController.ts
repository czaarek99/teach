import { ErrorState, ErrorModel } from "../../validation/ErrorModel";
import { IRegistrationModel } from "../models/IRegistrationModel";
import { LoadingButtonState } from "../../components/molecules/LoadingButton/LoadingButton";
import { IAddressModel } from "../models/IAddressModel";
import { MaterialUiPickersDate } from "@material-ui/pickers";

export interface IRegistrationPageErrorState extends ErrorState {
	firstName: string[]
	lastName: string[]
	email: string[]
	password: string[]
	repeatPassword: string[]
}

export interface IAddressErrorState extends ErrorState {
	street: string[]
	city: string[]
	zipCode: string[]
	state: string[]
}

export interface IRegistrationPageController {
	readonly registrationModel: IRegistrationModel;
	readonly registrationErrorModel: ErrorModel<IRegistrationPageErrorState>
	readonly addressModel: IAddressModel;
	readonly addressErrorModel: ErrorModel<IAddressErrorState>
	readonly loading: boolean;
	readonly errorMessage: string | null
	readonly registerButtonState: LoadingButtonState;

	onBirthDateChange: (date: MaterialUiPickersDate) => void
	onChange: (key: keyof IRegistrationModel, value: any) => void
	onAddressChange: (key: keyof IAddressModel, value: string) => void
	onRegister: () => Promise<void>
}