import { IPersonalInformationSettingsController } from "../settings/IPersonalInformationSettingsController";
import { IAddressSettingsController } from "../settings/IAddressSettingsController";

export interface ISettingsPageController {
	readonly loading: boolean

	readonly personalController: IPersonalInformationSettingsController
	readonly addressController: IAddressSettingsController
}