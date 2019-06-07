import { IUser } from "common-library";

export type LoginData = Pick<IUser, "email" | "password">;

export interface IAuthenticationService {
	logIn: (data: LoginData) => Promise<void>
	register: (data: IUser) => Promise<void>
}