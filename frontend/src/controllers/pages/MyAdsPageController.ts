import { IMyAdsPageController } from "../../interfaces/controllers/pages/IMyAdsPageController";
import { observable, action } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { HttpError, ErrorMessage, MAX_USER_AD_COUNT } from "common-library";
import { requireLogin } from "../../util/requireLogin";
import { AdController } from "../AdController";
import { RootStore } from "../../stores/RootStore";

export class MyAdsPageController implements IMyAdsPageController {

	@observable private readonly rootStore: RootStore;

	@observable public adControllers: IAdController[] = [];
	@observable public loading = true;
	@observable public pageError = "";
	@observable public canAdd = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const isLoggedIn = await requireLogin(this.rootStore);
		if(!isLoggedIn) {
			return;
		}

		try {
			const ads = await this.rootStore.services.adService.getMyAds();

			for(const ad of ads.data) {
				const adController = new AdController(this.rootStore);
				adController.load(ad);
				this.adControllers.push(adController);
			}

			const max = MAX_USER_AD_COUNT;
			this.canAdd = ads.totalCount < max;
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
		this.rootStore.editAd();
	}
}