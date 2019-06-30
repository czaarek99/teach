import { IUser, IPersonalInput, IAddress } from "common-library";

export interface IUserService {
	getSelf: () => Promise<IUser>
	updatePersonalInfo: (input: IPersonalInput) => Promise<void>
	updateAddress: (address: IAddress) => Promise<void>
}