import { ISettingsModel } from "../../models/ISettingsModel";
import { ViewModel } from "../../ViewModel";

export interface ISettingsPageController {
	readonly model: ViewModel<ISettingsModel>
}