import {
	IResetPasswordPageController, IResetPasswordPageErrorState
} from "../../interfaces/controllers/pages/IResetPasswordPageController";
import { observable } from "mobx";
import { ResetPasswordModel } from "../../models/ResetPasswordModel";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { ErrorModel } from "../../validation/ErrorModel";

export class ResetPasswordPageController implements IResetPasswordPageController {

	private readonly authenticationService: IAuthenticationService;

	@observable public model = new ResetPasswordModel();
	@observable public loading = false;
	@observable public errorModel = new ErrorModel<IResetPasswordPageErrorState>({
		password: [],
		repeatPassword: []
	});

	constructor(authenticationService: IAuthenticationService) {
		this.authenticationService = authenticationService;
	}

	public onChange(key: keyof ResetPasswordModel) : void {

	}

}