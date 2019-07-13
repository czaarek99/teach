import { ISettingsModel } from "../../models/ISettingsModel";
import { ViewModel } from "../../ViewModel";
import { LoadingButtonState } from "../../../components";

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