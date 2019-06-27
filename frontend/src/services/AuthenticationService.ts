import { BaseService } from "./BaseService";
import { IAuthenticationService } from "../interfaces/services/IAuthenticationService";

import {
	SESSION_COOKIE_NAME,
	USER_ID_COOKIE_NAME,
	ILoginInput,
	IRegistrationInput,
	IForgotInput,
	IResetPasswordInput
} from "common-library";

interface IAuthResponse {
	sessionId: string
	userId: number
	expirationDate: string
}

export class AuthenticationService extends BaseService implements IAuthenticationService {

	private setLoginData(auth: IAuthResponse) : void {
		localStorage.setItem(SESSION_COOKIE_NAME, auth.sessionId);
		localStorage.setItem(USER_ID_COOKIE_NAME, auth.userId.toString());
	}

	public async logIn(data: ILoginInput) : Promise<void> {
		const response = await this.axios.post<IAuthResponse>("/auth/login", data);
		this.setLoginData(response.data);
	}

	public async register(data: IRegistrationInput) : Promise<void> {
		const response = await this.axios.post<IAuthResponse>("/auth/register", data);
		this.setLoginData(response.data);
	}

	public async forgot(data: IForgotInput) : Promise<void> {
		await this.axios.post("/auth/forgot", data);
	}

	public async resetPassword(data: IResetPasswordInput) : Promise<void> {
		await this.axios.post("/auth/reset", data);
	}

}