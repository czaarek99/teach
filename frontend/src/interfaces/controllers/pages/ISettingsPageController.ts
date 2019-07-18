import { LoadingButtonState } from "../../../components";
import { ISettingsModel } from "../../models";

export interface ISettingsPageController {
	readonly viewModel: ISettingsModel
	readonly loading: boolean
	readonly saveButtonState: LoadingButtonState
	readonly errorMessage: string
	readonly showReset: boolean

	onReset: () => void
	onSave: () => Promise<void>
	onChange: (key: keyof ISettingsModel, value: any) => void
}