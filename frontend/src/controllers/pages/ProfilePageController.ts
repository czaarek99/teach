import { observable, action } from "mobx";
import { AddressProfileController } from "../profile/AddressProfileController";
import { AccountDetailsProfileController } from "../profile/AccountDetailsProfileController";
import { ProfilePictureController } from "../profile/ProfilePictureController";
import { HttpError, ErrorMessage } from "common-library";
import { requireLogin } from "../../util/requireLogin";
import { RootStore } from "../../stores/RootStore";

import {
	PersonalInformationProfileController
} from "../profile/PersonalInformationProfileController";

import {
	IProfilePageController,
} from "../../interfaces/controllers/pages/IProfilePageController";

export class ProfilePageController implements IProfilePageController {

	@observable private readonly rootStore: RootStore;

	@observable public loading = true;
	@observable public personalController: PersonalInformationProfileController;
	@observable public addressController: AddressProfileController;
	@observable public accountDetailsController: AccountDetailsProfileController;
	@observable public profilePictureController: ProfilePictureController;
	@observable public errorMessage = "";

	constructor(
		rootStore: RootStore
	) {
		this.rootStore = rootStore;

		this.personalController = new PersonalInformationProfileController(
			rootStore,
			this,
		);

		this.addressController = new AddressProfileController(
			rootStore,
			this,
		);

		this.accountDetailsController = new AccountDetailsProfileController(
			rootStore,
		);

		this.profilePictureController = new ProfilePictureController(
			rootStore,
			this,
		);

		this.load();
	}

	@action
	private async load() : Promise<void> {
		this.personalController.loadUserFromCache();
		this.addressController.loadUserFromCache();
		this.accountDetailsController.loadUserFromCache();

		const isLoggedIn = await requireLogin(this.rootStore);
		if(!isLoggedIn) {
			return;
		}

		await Promise.all([
			this.personalController.load(),
			this.addressController.load(),
			this.accountDetailsController.load(),
			this.profilePictureController.load()
		]);

		this.loading = false;
	}

	@action
	public onSnackbarClose() : void {
		this.errorMessage = "";
	}

	@action
	public serverError(error: any) : void {
		if(error instanceof HttpError) {
			this.errorMessage = error.error;
		} else {
			this.errorMessage = ErrorMessage.UNKNOWN;
			console.error(error);
		}
	}

	@action
	public setErrorMessage(errorMessage: string) {
		this.errorMessage = "";
	}
}