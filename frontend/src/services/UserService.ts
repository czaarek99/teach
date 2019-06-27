import { IUserService } from "../interfaces/services/IUserService";
import { BaseService } from "./BaseService";
import { IUser } from "common-library";

export class UserService extends BaseService implements IUserService {

	public async getSelf() : Promise<IUser> {
		const response = await this.axios.get<IUser>("/user/self");
		return response.data;
	}

}