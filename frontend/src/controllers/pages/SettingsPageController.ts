import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { Route } from "../../interfaces/Routes";
import { observable } from "mobx";
import { IUserService } from "../../interfaces/services/IUserService";
import { PersonalInformationSettingsController } from "../settings/PersonalInformationSettingsController";
import { AddressSettingsController } from "../settings/AddressSettingsController";

import {
	ISettingsPageController,
} from "../../interfaces/controllers/pages/ISettingsPageController";

export class SettingsPageController implements ISettingsPageController {

	private readonly userService: IUserService;
	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public loading = true;
	@observable public personalController: PersonalInformationSettingsController;
	@observable public addressController: AddressSettingsController;

	constructor(
		userService: IUserService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.userService = userService;
		this.routingStore = routingStore;
		this.userCache = userCache;

		this.personalController = new PersonalInformationSettingsController(
			userService,
			userCache
		);

		this.addressController = new AddressSettingsController(
			userService,
			userCache
		)

		this.load();
	}

	private async load() : Promise<void> {
		this.personalController.loadUserFromCache();
		this.addressController.loadUserFromCache();

		await this.userCache.recache();

		if(!this.userCache.isLoggedIn) {
			this.routingStore.push(Route.LOGIN);
		}

		await Promise.all([
			this.personalController.load(),
			this.addressController.load()
		])

		this.loading = false;
	}
}