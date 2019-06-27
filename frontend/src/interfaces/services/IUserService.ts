import { IUser } from "common-library";

export interface IUserService {
	getSelf: () => Promise<IUser>
}