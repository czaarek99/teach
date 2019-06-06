import { IAddress } from "./IAddress";

export interface IUser {
	id?: number
	firstName: string
	lastName: string
	email: string
	password?: string
	birthDate: Date
	address?: IAddress
}