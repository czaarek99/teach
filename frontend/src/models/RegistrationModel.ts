import { observable } from "mobx";
import { subMonths } from "date-fns";
import { getUserMaxDate } from "common-library";
import { IRegistrationModel } from "../interfaces/models/IRegistrationModel";

export class RegistrationModel implements IRegistrationModel {

	@observable public firstName = "";
	@observable public lastName = "";
	@observable public email = "";
	@observable public password = "";
	@observable public repeatPassword = "";
	@observable public birthDate = subMonths(getUserMaxDate(), 1);
	@observable public captcha : string | null = null;
	@observable public phoneNumber: string = "";

	public toJson() : IRegistrationModel {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			password: this.password,
			repeatPassword: this.repeatPassword,
			birthDate: this.birthDate,
			captcha: this.captcha,
			phoneNumber: this.phoneNumber
		}
	}


}