import { observable } from "mobx";
import { ILoginInput } from "common-library";
import { ILoginModel } from "../interfaces";

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