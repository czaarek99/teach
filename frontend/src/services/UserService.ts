import { IUserService } from "../interfaces/services/IUserService";
import { BaseService } from "./BaseService";
import { IUser, IPersonalInput, IAddress, IPasswordInput } from "common-library";

export class UserService extends BaseService implements IUserService {

	constructor() {
		super("/user");
	}

	public async getSelf() : Promise<IUser> {
		const response = await this.axios.get<IUser>("/self");
		return response.data;
	}

	public async updatePersonalInfo(input: IPersonalInput) : Promise<void> {
		await this.axios.patch("/personal", input);
	}

	public async updateAddress(address: IAddress) : Promise<void> {
		await this.axios.patch("/address", address);
	}

	public async updatePassword(input: IPasswordInput) : Promise<void> {
		await this.axios.patch("/password", input);
	}

}