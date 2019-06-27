import { IUser } from "../models";

export interface IRegistrationInput {
	user: Omit<IUser, "id">

	captcha: string | null
	password: string
}