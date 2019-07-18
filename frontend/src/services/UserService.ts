import { BaseService } from "./BaseService";

import {
	IUser,
	IPersonalInput,
	IAddress,
	IPasswordInput,
	ISearchUsersInput,
	ITeacher
} from "common-library";
import { IUserService } from "../interfaces";
import { objectToParams } from "../util";

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

	public async searchUsers(input: ISearchUsersInput) : Promise<ITeacher[]> {
		const params = objectToParams(input);

		const response = await this.axios.get<ITeacher[]>(`/search?${params}`);
		return response.data;
	}

}