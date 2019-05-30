import { IAuthenticationService, IRegistrationData } from "../interfaces/services/IAuthenticationService";
import Axios from "axios";

export class AuthenticationService implements IAuthenticationService {

	public async logIn(email: string, password: string) : Promise<void> {
		await Axios.post("/auth/login", {
			email,
			password
		});
	}

	public async register(data: IRegistrationData) : Promise<void> {
		await Axios.post("/auth/register", data);
	}

}