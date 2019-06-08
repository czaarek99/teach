import { IResetPasswordModel } from "../interfaces/models/IResetPasswordModel";
import { observable } from "mobx";

export class ResetPasswordModel implements IResetPasswordModel {

	@observable public resetKey = "";
	@observable public password = "";

	public toJson() : IResetPasswordModel {
		return {
			resetKey: this.resetKey,
			password: this.password
		}
	}

}