import { observable } from "mobx";
import { IForgotModel } from "../interfaces/models/IForgotModel";
import { IForgotInput } from "common-library";

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