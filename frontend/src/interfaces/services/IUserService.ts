import {
	IUser,
	IPersonalInput,
	IAddress,
	IPasswordInput,
	ITeacher,
	ISearchUsersInput
} from "common-library";

export interface IUserService {
	getSelf: () => Promise<IUser>
	searchUsers: (input: ISearchUsersInput) => Promise<ITeacher[]>
	updatePersonalInfo: (input: IPersonalInput) => Promise<void>
	updateAddress: (address: IAddress) => Promise<void>
	updatePassword: (input: IPasswordInput) => Promise<void>
}