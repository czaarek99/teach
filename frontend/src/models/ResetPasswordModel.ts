import { IResetPasswordModel } from "../interfaces/models/IResetPasswordModel";
import { observable } from "mobx";

export class ResetPasswordModel implements IResetPasswordModel {

	@observable public resetKey = "";
	@observable public password = "";
	@observable public repeatPassword = "";

	public toJson() : IResetPasswordModel {
		return {
			resetKey: this.resetKey,
			password: this.password,
			repeatPassword: this.repeatPassword
		}
	}

}