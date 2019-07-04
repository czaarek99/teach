import { IPersonalInformationProfileController } from "../profile/IPersonalInformationProfileController";
import { IAddressProfileController } from "../profile/IAddressProfileController";
import { IAccountDetailsProfileController } from "../profile/IAccountDetailsProfileController";
import { IProfilePictureController } from "../profile/IProfilePictureController";

export interface IProfilePageController {
	readonly loading: boolean
	readonly errorMessage: string

	onSnackbarClose: () => void

	readonly personalController: IPersonalInformationProfileController
	readonly addressController: IAddressProfileController
	readonly accountDetailsController: IAccountDetailsProfileController
	readonly profilePictureController: IProfilePictureController
}