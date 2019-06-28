import { observable } from "mobx";
import { subMonths } from "date-fns";
import { getUserMaxDate, IRegistrationInput } from "common-library";
import { IRegistrationModel } from "../interfaces/models/IRegistrationModel";

export class RegistrationModel implements IRegistrationModel {

	@observable public birthDate = subMonths(getUserMaxDate(), 1);
	@observable public captcha : string | null = "";
	@observable public firstName = "";
	@observable public lastName = "";
	@observable public email = "";
	@observable public password = "";
	@observable public repeatPassword = "";
	@observable public phoneNumber = "";
	@observable public street = "";
	@observable public zipCode = "";
	@observable public city = "";
	@observable public countryCode = "SE";
	@observable public state = "";

	public toValidate() : IRegistrationModel {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			birthDate: this.birthDate,
			email: this.email,
			phoneNumber: this.phoneNumber,
			street: this.street,
			zipCode: this.zipCode,
			city: this.city,
			countryCode: this.countryCode,
			state: this.state,
			password: this.password,
			repeatPassword: this.repeatPassword,
			captcha: this.captcha,
		}
	}

	public toJson() : IRegistrationInput {
		return {
			user: {
				firstName: this.firstName,
				lastName: this.lastName,
				birthDate: this.birthDate,
				email: this.email,
				phoneNumber: this.phoneNumber,
				address: {
					street: this.street,
					zipCode: this.zipCode,
					city: this.city,
					countryCode: this.countryCode,
					state: this.state
				}
			},

			password: this.password,
			captcha: this.captcha,
		}
	}


}