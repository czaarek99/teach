import { BaseService } from "./BaseService";
import { IAuthenticationService, LoginData } from "../interfaces/services/IAuthenticationService";
import { IUser, IForgot, IResetPassword } from "common-library";

export class AuthenticationService extends BaseService implements IAuthenticationService {

	public async logIn(data: LoginData) : Promise<void> {
		await this.axios.post("/auth/login", data);
	}

	public async register(data: IUser) : Promise<void> {
		await this.axios.post("/auth/register", data);
	}

	public async forgot(data: IForgot) : Promise<void> {
		await this.axios.post("/auth/forgot", data);
	}

	public async resetPassword(data: IResetPassword) : Promise<void> {
		await this.axios.post("/auth/reset", data);
	}

}