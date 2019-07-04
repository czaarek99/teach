import { IMyAdsPageController } from "../../interfaces/controllers/pages/IMyAdsPageController";
import { observable, action } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { IAdService } from "../../interfaces/services/IAdService";
import { HttpError, ErrorMessage } from "common-library";

export class MyAdsPageController implements IMyAdsPageController {

	private readonly adService: IAdService;

	@observable public adControllers: IAdController[] = [];
	@observable public loading = true;
	@observable public pageError = "";

	constructor(adService: IAdService) {
		this.adService = adService;

		this.load();
	}

	@action
	private async load() : Promise<void> {
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

	}
}