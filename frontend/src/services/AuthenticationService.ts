import { BaseService } from "./BaseService";
import { IAuthenticationService, LoginData } from "../interfaces/services/IAuthenticationService";
import { IUser, IForgot, IResetPassword, SESSION_COOKIE_NAME, USER_ID_COOKIE_NAME } from "common-library";

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

	public async logIn(data: LoginData) : Promise<void> {
		const response = await this.axios.post<IAuthResponse>("/auth/login", data);
		this.setLoginData(response.data);
	}

	public async register(data: IUser) : Promise<void> {
		const response = await this.axios.post<IAuthResponse>("/auth/register", data);
		this.setLoginData(response.data);
	}

	public async forgot(data: IForgot) : Promise<void> {
		await this.axios.post("/auth/forgot", data);
	}

	public async resetPassword(data: IResetPassword) : Promise<void> {
		await this.axios.post("/auth/reset", data);
	}

}