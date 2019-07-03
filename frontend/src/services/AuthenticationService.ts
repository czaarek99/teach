import { BaseService } from "./BaseService";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";

import {
	ILoginInput,
	IRegistrationInput,
	IForgotInput,
	IResetPasswordInput,
	IAuthOutput
} from "common-library";

export class AuthenticationService extends BaseService implements IAuthenticationService {

	constructor() {
		super("/auth");
	}

	public async logIn(data: ILoginInput) : Promise<IAuthOutput> {
		const response = await this.axios.post<IAuthOutput>("/login", data);
		return response.data;
	}

	public async register(data: IRegistrationInput) : Promise<IAuthOutput> {
		const response = await this.axios.post<IAuthOutput>("/register", data);
		return response.data;
	}

	public async forgot(data: IForgotInput) : Promise<void> {
		await this.axios.post("/forgot", data);
	}

	public async resetPassword(data: IResetPasswordInput) : Promise<void> {
		await this.axios.post("/reset", data);
	}

	public async logOut() : Promise<void> {
		await this.axios.post("/logout");
	}

}