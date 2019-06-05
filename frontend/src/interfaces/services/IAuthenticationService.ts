export interface IRegistrationData {
	email: string
	password: string
	firstName: string
	lastName: string
}

export interface ILoginData {
	email: string
	password: string
}

export interface IAuthenticationService {
	logIn: (data: ILoginData) => Promise<void>
	register: (data: IRegistrationData) => Promise<void>
}