import { IMyAdsPageController } from "../../interfaces/controllers/pages/IMyAdsPageController";
import { observable, action } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { IAdService } from "../../interfaces/services/IAdService";
import { HttpError, ErrorMessage, MAX_USER_AD_COUNT } from "common-library";
import { RouterStore } from "mobx-react-router";
import { IUserCache } from "../../util/UserCache";
import { requireLogin } from "../../util/requireLogin";
import { AdController } from "../AdController";
import { IAppController } from "../../interfaces/controllers/IAppController";

export class MyAdsPageController implements IMyAdsPageController {

	private readonly parent: IAppController;
	private readonly adService: IAdService;
	private readonly routingStore: RouterStore;
	private readonly userCache: IUserCache;

	@observable public adControllers: IAdController[] = [];
	@observable public loading = true;
	@observable public pageError = "";
	@observable public canAdd = false;

	constructor(
		parent: IAppController,
		adService: IAdService,
		routingStore: RouterStore,
		userCache: IUserCache
	) {
		this.parent = parent;
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
			const ads = await this.adService.getMyAds();

			for(const ad of ads.data) {
				const adController = new AdController(this.routingStore);
				adController.load(ad);
				this.adControllers.push(adController);
			}

			this.canAdd = ads.totalCount < MAX_USER_AD_COUNT;
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
		this.parent.onEditAd();
	}
}