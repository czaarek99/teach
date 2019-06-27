import { ILoginModel } from "../interfaces/models/ILoginModel";
import { observable } from "mobx";
import { ILoginInput } from "common-library";

export class LoginModel implements ILoginModel {

	@observable public email = "";
	@observable public password = "";

	public toInput() : ILoginInput {
		return {
			email: this.email,
			password: this.password
		}
	}

}