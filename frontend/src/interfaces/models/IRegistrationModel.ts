export interface IRegistrationModel {
	readonly firstName: string
	readonly lastName: string
	readonly email: string
	readonly password: string
	readonly repeatPassword: string
	readonly birthDate: Date

	readonly captcha: string | null
	readonly phoneNumber: string

	readonly street: string
	readonly zipCode: string
	readonly city: string
	readonly countryCode: string
	readonly state?: string
}