import { IUser } from "common-library";

export type IRegistrationModel = Readonly<IUser> & {
	readonly repeatPassword: string
}