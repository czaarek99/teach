import { IMyAdsPageController } from "../../interfaces/controllers/pages/IMyAdsPageController";
import { observable, action } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { IAdService } from "../../interfaces/services/IAdService";
import { HttpError, ErrorMessage } from "common-library";
import { RouterStore } from "mobx-react-router";
import { Route } from "../../interfaces/Routes";
import { IUserCache } from "../../util/UserCache";
import { requireLogin } from "../../util/requireLogin";

export class MyAdsPageController implements IMyAdsPageController {

	private readonly adService: IAdService;
	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public adControllers: IAdController[] = [];
	@observable public loading = true;
	@observable public pageError = "";

	constructor(
		adService: IAdService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.adService = adService;
		this.routingStore = routingStore;
		this.userCache = userCache;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const isLoggedIn = await requireLogin(this.userCache, this.routingStore);
		if(!isLoggedIn) {
			return;
		}

		try {
			//const ads = await this.adService.getMyAds();

		} catch (error) {
			if(error instanceof HttpError) {
				this.pageError = error.error;
			} else {
				this.pageError = ErrorMessage.UNKNOWN;
				console.error(error);
			}
		}


		this.loading = false;
	}

	@action
	public onNewAd() : void {
		this.routingStore.push(Route.NEW_AD);
	}
}