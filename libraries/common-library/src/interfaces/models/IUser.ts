import { IAddress } from "./IAddress";

export interface IUser {
	id: number
	firstName: string
	lastName: string
	birthDate: Date
	email: string
	address: IAddress
	phoneNumber?: string
	avatarFileName?: string
}