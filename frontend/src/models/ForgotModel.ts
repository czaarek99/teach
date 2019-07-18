import { observable } from "mobx";
import { IForgotInput } from "common-library";
import { IForgotModel } from "../interfaces";

export class ForgotModel implements IForgotModel {

	@observable public email = "";
	@observable public captcha : string | null = null;

	public toInput() : IForgotInput {
		return {
			email: this.email,
			captcha: this.captcha
		}
	}

}