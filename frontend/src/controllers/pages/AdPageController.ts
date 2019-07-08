import { IAdPageController } from "../../interfaces/controllers/pages/IAdPageController";
import { observable, action, computed } from "mobx";
import { IAd, ErrorMessage, HttpError } from "common-library";
import { Route } from "../../interfaces/Routes";
import { RootStore } from "../../stores/RootStore";

export class AdPageController implements IAdPageController {

	@observable private readonly rootStore: RootStore;

	@observable public ad: IAd | null = null;
	@observable public errorMessage = "";
	@observable public carouselStep = 0;
	@observable public showConfirmDeleteDialog = false;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		await this.rootStore.userCache.recache();

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

	@computed
	public get isMyAd() : boolean {
		const user = this.rootStore.userCache.user;

		return user !== undefined &&
			this.ad !== null &&
			user.id === this.ad.teacher.id;
	}

	@computed
	public get carouselCanGoBack() : boolean {
		return this.carouselStep !== 0;
	}

	@computed
	public get adImageCount() : number {
		if(this.ad) {
			return this.ad.images.length;
		}

		return 0;
	}

	@computed
	public get carouselCanGoNext() : boolean {
		return this.carouselStep < this.adImageCount - 1;
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

	@action
	public edit() : void {
		if(this.ad) {
			this.rootStore.editAd(this.ad.id);
		}
	}

	@action
	public openConfirmDialog() : void {
		this.showConfirmDeleteDialog = true;
	}

	@action
	public closeConfirmDialog() : void {
		this.showConfirmDeleteDialog = false;
	}

	@action
	public async delete() : Promise<void> {
		if(this.ad) {
			try {
				await this.rootStore.services.adService.deleteAd(this.ad.id);
				this.rootStore.routingStore.replace(Route.HOME);
			} catch(error) {
				if(error instanceof HttpError) {
					this.errorMessage = error.error;
				} else {
					console.error(error)
					this.errorMessage = ErrorMessage.COMPONENT;
				}
			}
		}
	}
}