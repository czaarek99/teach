import { ILoginPageModel } from "../models/ILoginPageModel";

export interface ILoginPageController {
	readonly model: ILoginPageModel;

	onChange: (value: string) => void
}