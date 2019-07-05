import { INewAdModel } from "../../models/INewAdModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { LoadingButtonState } from "../../../components";

export interface INewAdPageErrorState extends ErrorState {
	name: string[]
	description: string[]
}

export interface INewAdPageController {
	readonly model: INewAdModel;
	readonly errorModel: ErrorModel<INewAdPageErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly pageError: string

	onCloseSnackbar: () => void
	onSave: () => Promise<void>
	onChange: (key: keyof INewAdModel, value: any) => void
}