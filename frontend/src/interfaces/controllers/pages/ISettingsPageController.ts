import { IPersonalInformationSettingsController } from "../IPersonalInformationSettingsController";
import { IAddressSettingsController } from "../IAddressSettingsController";

export interface ISettingsPageController {
	readonly loading: boolean

	readonly personalController: IPersonalInformationSettingsController
	readonly addressController: IAddressSettingsController
}