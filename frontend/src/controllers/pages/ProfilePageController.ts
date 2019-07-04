import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable, action } from "mobx";
import { IUserService } from "../../interfaces/services/IUserService";
import { AddressProfileController } from "../profile/AddressProfileController";
import { AccountDetailsProfileController } from "../profile/AccountDetailsProfileController";
import { ProfilePictureController } from "../profile/ProfilePictureController";
import { IImageService } from "../../interfaces/services/IImageService";

import {
	PersonalInformationProfileController
} from "../profile/PersonalInformationProfileController";

import {
	IProfilePageController,
} from "../../interfaces/controllers/pages/IProfilePageController";
import { HttpError } from "common-library";

export class ProfilePageController implements IProfilePageController {

	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public loading = true;
	@observable public personalController: PersonalInformationProfileController;
	@observable public addressController: AddressProfileController;
	@observable public accountDetailsController: AccountDetailsProfileController;
	@observable public profilePictureController: ProfilePictureController;
	@observable public errorMessage = "";

	constructor(
		userService: IUserService,
		imageService: IImageService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.routingStore = routingStore;
		this.userCache = userCache;

		this.personalController = new PersonalInformationProfileController(
			this,
			userService,
			userCache
		);

		this.addressController = new AddressProfileController(
			this,
			userService,
			userCache
		);

		this.accountDetailsController = new AccountDetailsProfileController(
			userCache,
			userService,
		);

		this.profilePictureController = new ProfilePictureController(
			this,
			userCache,
			imageService
		);

		this.load();
	}

	@action
	private async load() : Promise<void> {
		this.personalController.loadUserFromCache();
		this.addressController.loadUserFromCache();
		this.accountDetailsController.loadUserFromCache();

		await this.userCache.recache();

		if(!this.userCache.isLoggedIn) {
			this.routingStore.push(Route.LOGIN);
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
	public serverError(error) : void {

		if(error instanceof HttpError) {
			this.errorMessage = error.error;
		} else {
			console.error(error);
		}
	}

	@action
	public setErrorMessage(errorMessage: string) {
		this.errorMessage = "";
	}
}