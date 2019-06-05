import { ILoginModel } from "../interfaces/models/ILoginModel";
import { observable } from "mobx";

export class LoginModel implements ILoginModel {

	@observable public email = "";
	@observable public password = "";

	public toJson() : ILoginModel {
		return {
			email: this.email,
			password: this.password
		}
	}

}