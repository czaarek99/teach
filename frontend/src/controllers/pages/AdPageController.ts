import { IAdPageController } from "../../interfaces/controllers/pages/IAdPageController";
import { observable, action } from "mobx";
import { IAd, ErrorMessage } from "common-library";
import { Route } from "../../interfaces/Routes";
import { RootStore } from "../../stores/RootStore";

export class AdPageController implements IAdPageController {

	@observable private readonly rootStore: RootStore;

	@observable public ad: IAd | null = null;
	@observable public errorMessage = "";
	@observable public carouselStep = 0;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

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
			const ad = await this.rootStore.services.adService.getAd(adId);
			this.ad = ad;
		} catch(error) {
			this.showAdNotFound();
		}
	}

	@action
	public goBackToBrowse() : void {
		this.rootStore.routingStore.push(Route.BROWSE);
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