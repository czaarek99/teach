import { observable } from "mobx";
import { subYears } from "date-fns";
import { USER_MIN_AGE } from "common-library";
import { IRegistrationModel } from "../interfaces/models/IRegistrationModel";

export class RegistrationModel implements IRegistrationModel {

	@observable public firstName = "";
	@observable public lastName = "";
	@observable public email = "";
	@observable public password = "";
	@observable public repeatPassword = "";
	@observable public birthDate = subYears(new Date(), USER_MIN_AGE);

	public toJson() : IRegistrationModel {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			password: this.password,
			repeatPassword: this.repeatPassword,
			birthDate: this.birthDate,
		}
	}


}