import { observable } from "mobx";
import { IForgotModel } from "../interfaces/models/IForgotModel";

export class ForgotModel implements IForgotModel {

	@observable public email = "";
	@observable public captcha : string | null = null;

	public toJson() : IForgotModel {
		return {
			email: this.email,
			captcha: this.captcha
		}
	}

}