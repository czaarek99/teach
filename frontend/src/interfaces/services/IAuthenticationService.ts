import {
	ILoginInput,
	IRegistrationInput,
	IForgotInput,
	IResetPasswordInput,
	IAuthOutput
} from "common-library";

export interface IAuthenticationService {
	logIn: (data: ILoginInput) => Promise<IAuthOutput>
	logOut: () => Promise<void>
	register: (data: IRegistrationInput) => Promise<IAuthOutput>
	forgot: (email: IForgotInput) => Promise<void>
	resetPassword: (reset: IResetPasswordInput) => Promise<void>
}