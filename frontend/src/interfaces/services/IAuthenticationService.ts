import { ILoginInput, IRegistrationInput, IForgotInput, IResetPasswordInput } from "common-library";

export interface IAuthenticationService {
	logIn: (data: ILoginInput) => Promise<void>
	register: (data: IRegistrationInput) => Promise<void>
	forgot: (email: IForgotInput) => Promise<void>
	resetPassword: (reset: IResetPasswordInput) => Promise<void>
}