export interface IRegistrationData {
	email: string
	password: string
	firstName: string
	lastName: string
}

export interface IAuthenticationService {
	logIn: (email: string, password: string) => Promise<void>
	register: (data: IRegistrationData) => Promise<void>
}