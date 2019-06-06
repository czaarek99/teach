import { IRegistrationPageController, IRegistrationPageErrorState, IAddressErrorState } from "../interfaces/controllers/IRegistrationPageController";
import { observable } from "mobx";
import { RegistrationModel } from "../models/RegistrationModel";
import { ErrorModel } from "../validation/ErrorModel";
import { AddressModel } from "../models/AddressModel";
import { LoadingButtonState } from "../components/molecules/LoadingButton/LoadingButton";
import { IRegistrationModel } from "../interfaces/models/IRegistrationModel";
import { IAddressModel } from "../interfaces/models/IAddressModel";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";
import { MaterialUiPickersDate } from "@material-ui/pickers";

export class RegistrationPageController implements IRegistrationPageController {

	private readonly authenticationService: IAuthenticationService;

	@observable public registrationModel = new RegistrationModel();
	@observable public addressModel = new AddressModel();
	@observable public loading = false;
	@observable public errorMessage : string | null = null;
	@observable public registerButtonState: LoadingButtonState = "default";

	@observable public registrationErrorModel = new ErrorModel<IRegistrationPageErrorState>({
		email: [],
		password: [],
		repeatPassword: [],
		firstName: [],
		lastName: []
	});

	@observable public addressErrorModel = new ErrorModel<IAddressErrorState>({
		city: [],
		zipCode: [],
		street: [],
		state: []
	});

	constructor(authenticationService: IAuthenticationService) {
		this.authenticationService = authenticationService;
	}

	public onChange(key: keyof IRegistrationModel, value: any) : void {
		this.registrationModel[key as (keyof RegistrationModel)] = value;
	}

	public onAddressChange(key: keyof IAddressModel, value: string) : void {

	}

	public async onRegister() : Promise<void> {

	}

	public onBirthDateChange(date: MaterialUiPickersDate) : void {
		if(date !== null) {
			this.registrationModel.birthDate = date;
		}
	}

}