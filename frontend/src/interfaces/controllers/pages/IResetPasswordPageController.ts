import { IResetPasswordModel } from "../../models/IResetPasswordModel";

export interface IResetPasswordPageController {
	readonly model: IResetPasswordModel;

	onChange: (key: keyof IResetPasswordModel, value: string) => void
}