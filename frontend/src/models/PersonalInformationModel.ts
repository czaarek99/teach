import { observable, action } from "mobx";
import { IUser, IPersonalInput } from "common-library";
import { IPersonalInformationModel } from "../interfaces";

export class PersonalInformationModel implements IPersonalInformationModel {

	@observable public firstName = "";
	@observable public lastName = "";
	@observable public birthDate = new Date();
	@observable public phoneNumber = "";

	@action public fromJson(user: IUser) : void {
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.birthDate = user.birthDate;

		if(user.phoneNumber) {
			this.phoneNumber = user.phoneNumber;
		} else {
			this.phoneNumber = "";
		}
	}

	public toInput() : IPersonalInput {
		return {
			firstName: this.firstName,
			lastName: this.lastName,
			birthDate: this.birthDate,
			phoneNumber: this.phoneNumber
		}
	}

}