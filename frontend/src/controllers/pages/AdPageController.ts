import { IAdPageController } from "../../interfaces/controllers/pages/IAdPageController";
import { observable, action } from "mobx";
import { IAdService } from "../../interfaces/services/IAdService";
import { IAd, ErrorMessage } from "common-library";
import { RouterStore } from "mobx-react-router";
import { Route } from "../../interfaces/Routes";

export class AdPageController implements IAdPageController {

	private readonly adService: IAdService;
	private readonly routingStore: RouterStore;

	@observable public ad: IAd | null = null;
	@observable public errorMessage = "";
	@observable public carouselStep = 0;

	constructor(adService: IAdService, routingStore: RouterStore) {
		this.adService = adService;
		this.routingStore = routingStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const searchParams = new URLSearchParams(window.location.search);
		const idString = searchParams.get("adId");

		if(!idString) {
			this.showAdNotFound();
			return;
		}

		const adId = parseInt(idString);
		if(Number.isNaN(adId)) {
			this.showAdNotFound();
			return;
		}

		try {
			const ad = await this.adService.getAd(adId);
			this.ad = ad;
		} catch(error) {
			this.showAdNotFound();
		}
	}

	@action
	public goBackToBrowse() : void {
		this.routingStore.push(Route.BROWSE);
	}

	@action
	private showAdNotFound() : void {
		this.errorMessage = ErrorMessage.AD_NOT_FOUND;
	}

	@action
	public closeSnackbar() : void {
		this.errorMessage = "";
	}

	@action
	public onCarouselForward() : void {
		this.carouselStep++;
	}

	@action
	public onCarouselBack() : void {
		this.carouselStep--;
	}

}