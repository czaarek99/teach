import { IUser, IPersonalInput, IAddress, IPasswordInput } from "common-library";

export interface IUserService {
	getSelf: () => Promise<IUser>
	updatePersonalInfo: (input: IPersonalInput) => Promise<void>
	updateAddress: (address: IAddress) => Promise<void>
	updatePassword: (input: IPasswordInput) => Promise<void>
}