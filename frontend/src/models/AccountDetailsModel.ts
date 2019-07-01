import { IAccountDetailsModel } from "../interfaces/models/IAccountDetailsModel";
import { observable } from "mobx";
import { IPasswordInput } from "common-library";

export class AccountDetailsModel implements IAccountDetailsModel {

	@observable public repeatPassword = "";
	@observable public newPassword = "";
	@observable public currentPassword = "";

	public toInput() : IPasswordInput {
		return {
			newPassword: this.newPassword,
			currentPassword: this.currentPassword
		}
	}

	public toValidate() : IAccountDetailsModel {
		return {
			repeatPassword: this.repeatPassword,
			newPassword: this.newPassword,
			currentPassword: this.currentPassword
		}
	}
}