import { IUser } from "../models";

export interface IAuthOutput {
	readonly sessionId: string
	readonly expirationDate: number
	readonly user: IUser
}