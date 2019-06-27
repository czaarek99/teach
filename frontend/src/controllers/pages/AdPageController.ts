import { IAdPageController } from "../../interfaces/controllers/pages/IAdPageController";
import { observable } from "mobx";
import { IAdService } from "../../interfaces/services/IAdService";
import { IAd } from "common-library";

export class AdPageController implements IAdPageController {

	private readonly adService: IAdService;

	@observable public ad: IAd | null = null;

	constructor(adService: IAdService) {
		this.adService = adService;

		this.load();
	}

	private async load() : Promise<void> {
		const searchParams = new URLSearchParams(window.location.search);

		const idString = searchParams.get("adId");
		if(idString) {
			const adId = parseInt(idString);

			const ad = await this.adService.getAd(adId);
			this.ad = ad;
		} else {

		}
	}

}