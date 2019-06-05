import { IAuthenticationService, IRegistrationData, ILoginData } from "../interfaces/services/IAuthenticationService";
import { BaseService } from "./BaseService";

export class AuthenticationService extends BaseService implements IAuthenticationService {

	public async logIn(data: ILoginData) : Promise<void> {
		await this.axios.post("/auth/login", data);
	}

	public async register(data: IRegistrationData) : Promise<void> {
		await this.axios.post("/auth/register", data);
	}

}