import { IResetPasswordModel } from "../interfaces/models/IResetPasswordModel";
import { observable } from "mobx";
import { IResetPasswordInput } from "common-library";

export class ResetPasswordModel implements IResetPasswordModel {

	@observable public resetKey = "";
	@observable public password = "";
	@observable public repeatPassword = "";

	public toValidate() : IResetPasswordModel {
		return {
			resetKey: this.resetKey,
			password: this.password,
			repeatPassword: this.repeatPassword
		}
	}

	public toInput() : IResetPasswordInput {
		return {
			resetKey: this.resetKey,
			password: this.password,
		}
	}

}