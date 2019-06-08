import {
	IResetPasswordPageController
} from "../../interfaces/controllers/pages/IResetPasswordPageController";
import { observable } from "mobx";
import { ResetPasswordModel } from "../../models/ResetPasswordModel";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";

export class ResetPasswordPageController implements IResetPasswordPageController {

	private readonly authenticationService: IAuthenticationService;

	@observable public model = new ResetPasswordModel();

	constructor(authenticationService: IAuthenticationService) {
		this.authenticationService = authenticationService;
	}

	public onChange(key: keyof ResetPasswordModel) : void {

	}

}