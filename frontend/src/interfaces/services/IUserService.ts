import {
	IUser,
	IPersonalInput,
	IAddress,
	IPasswordInput,
	ISimpleIdInput
} from "common-library";

export interface IUserService {
	getSelf: () => Promise<IUser>
	updatePersonalInfo: (input: IPersonalInput) => Promise<void>
	updateAddress: (address: IAddress) => Promise<void>
	updatePassword: (input: IPasswordInput) => Promise<void>
	updateProfilePicture: (input: ISimpleIdInput) => Promise<void>
}