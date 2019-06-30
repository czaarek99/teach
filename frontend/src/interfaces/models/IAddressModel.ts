export interface IAddressModel {
	readonly street: string
	readonly city: string
	readonly zipCode: string
	readonly countryCode: string
	readonly state?: string
}