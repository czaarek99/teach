import { IUser, IForgot, IResetPassword } from "common-library";

export type LoginData = Pick<IUser, "email" | "password">;

export interface IAuthenticationService {
	logIn: (data: LoginData) => Promise<void>
	register: (data: IUser) => Promise<void>
	forgot: (email: IForgot) => Promise<void>
	resetPassword: (reset: IResetPassword) => Promise<void>
}