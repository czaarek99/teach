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

	public async logIn(data: ILoginInput) : Promise<IAuthOutput> {
		const response = await this.axios.post<IAuthOutput>("/auth/login", data);
		return response.data;
	}

	public async register(data: IRegistrationInput) : Promise<IAuthOutput> {
		const response = await this.axios.post<IAuthOutput>("/auth/register", data);
		return response.data;
	}

	public async forgot(data: IForgotInput) : Promise<void> {
		await this.axios.post("/auth/forgot", data);
	}

	public async resetPassword(data: IResetPasswordInput) : Promise<void> {
		await this.axios.post("/auth/reset", data);
	}

}