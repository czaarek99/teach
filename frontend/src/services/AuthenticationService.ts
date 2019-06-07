import { BaseService } from "./BaseService";
import { IAuthenticationService, LoginData } from "../interfaces/services/IAuthenticationService";
import { IUser } from "common-library";

export class AuthenticationService extends BaseService implements IAuthenticationService {

	public async logIn(data: LoginData) : Promise<void> {
		await this.axios.post("/auth/login", data);
	}

	public async register(data: IUser) : Promise<void> {
		await this.axios.post("/auth/register", data);
	}

}