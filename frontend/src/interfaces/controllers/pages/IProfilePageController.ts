import {
	IPersonalInformationProfileController,
	IAddressProfileController,
	IAccountDetailsProfileController,
	IProfilePictureController
} from "../profile";

export interface IProfilePageController {
	readonly loading: boolean
	readonly errorMessage: string

	onSnackbarClose: () => void

	readonly personalController: IPersonalInformationProfileController
	readonly addressController: IAddressProfileController
	readonly accountDetailsController: IAccountDetailsProfileController
	readonly profilePictureController: IProfilePictureController
}