import { IPersonalInformationSettingsController } from "../settings/IPersonalInformationSettingsController";
import { IAddressSettingsController } from "../settings/IAddressSettingsController";
import { IAccountDetailsSettingsController } from "../settings/IAccountDetailsSettingsController";

export interface ISettingsPageController {
	readonly loading: boolean

	readonly personalController: IPersonalInformationSettingsController
	readonly addressController: IAddressSettingsController
	readonly accountDetailsController: IAccountDetailsSettingsController
}