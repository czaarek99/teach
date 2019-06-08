import { IUser, IAddress } from "common-library";

export interface IRegistrationModel extends Readonly<IUser> {
	readonly repeatPassword: string
	readonly captcha: string | null;
}