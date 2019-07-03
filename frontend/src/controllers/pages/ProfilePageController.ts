import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable } from "mobx";
import { IUserService } from "../../interfaces/services/IUserService";
import { PersonalInformationProfileController } from "../profile/PersonalInformationProfileController";
import { AddressProfileController } from "../profile/AddressProfileController";
import { AccountDetailsProfileController } from "../profile/AccountDetailsProfileController";

import {
	IProfilePageController,
} from "../../interfaces/controllers/pages/IProfilePageController";


export class ProfilePageController implements IProfilePageController {

	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public loading = true;
	@observable public personalController: PersonalInformationProfileController;
	@observable public addressController: AddressProfileController;
	@observable public accountDetailsController: AccountDetailsProfileController;

	constructor(
		userService: IUserService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.routingStore = routingStore;
		this.userCache = userCache;

		this.personalController = new PersonalInformationProfileController(
			userService,
			userCache
		);

		this.addressController = new AddressProfileController(
			userService,
			userCache
		);

		this.accountDetailsController = new AccountDetailsProfileController(
			userCache,
			userService,
		);

		this.load();
	}

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
			this.accountDetailsController.load()
		]);

		this.loading = false;
	}
}