import { observable, action } from "mobx";
import { HttpError, ErrorMessage } from "common-library";
import { IProfilePageController } from "../../interfaces";
import { RootStore } from "../../stores";
import { requireLogin } from "../../util";

import {
	PersonalInformationProfileController,
	AddressProfileController,
	AccountDetailsProfileController,
	ProfilePictureController
} from "../profile";

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