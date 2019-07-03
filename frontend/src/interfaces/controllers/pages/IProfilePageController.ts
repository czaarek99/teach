import { IPersonalInformationProfileController } from "../profile/IPersonalInformationProfileController";
import { IAddressProfileController } from "../profile/IAddressProfileController";
import { IAccountDetailsProfileController } from "../profile/IAccountDetailsProfileController";

export interface IProfilePageController {
	readonly loading: boolean

	readonly personalController: IPersonalInformationProfileController
	readonly addressController: IAddressProfileController
	readonly accountDetailsController: IAccountDetailsProfileController
}