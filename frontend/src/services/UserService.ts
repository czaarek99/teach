import { IUserService } from "../interfaces/services/IUserService";
import { BaseService } from "./BaseService";
import { ITeacher } from "common-library";

export class UserService extends BaseService implements IUserService {

	public async getSelf() : Promise<ITeacher> {
		const response = await this.axios.get<ITeacher>("/user/self");
		return response.data;
	}

	public async getUser(id: number) : Promise<ITeacher> {
		const response = await this.axios.get("/user/" + id);
		return response.data;
	}

}