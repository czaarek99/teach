import { observable, action } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { AdController } from "../AdController";
import { RootStore } from "../../stores/RootStore";
import { IAdFilterModel } from "../../interfaces/models/IAdFilterModel";
import { AdFilterModel } from "../../models/AdFilterModel";
import { LoadingButtonState } from "../../components";

import {
	IBrowsePageController
} from "../../interfaces/controllers/pages/IBrowsePageController";
import { ErrorMessage, HttpError } from "common-library";

export class BrowsePageController implements IBrowsePageController {

	@observable private readonly rootStore: RootStore;

	@observable public filterButtonState : LoadingButtonState = "default"
	@observable public filterLoading = false;
	@observable public pageNumber = 0;
	@observable public totalAdCount = 0;
	@observable public adsPerPage = 50;
	@observable public activeAdControllers : IAdController[] = [];
	@observable public pageLoading = true;
	@observable public listLoading = true;
	@observable public adFilterModel = new AdFilterModel();
	@observable public pageError = "";

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		this.filterButtonState = "loading";

		try {
			const input = this.adFilterModel.toInput(0, 0);
			const info = await this.rootStore.services.adService.getAds(input);

			this.pageNumber = 0;
			this.activeAdControllers = [];
			this.totalAdCount = info.totalCount;
			this.loadAds();
		} catch(error) {
			this.serverError(error);
		} finally {
			this.pageLoading = false;
		}
	}

	@action
	private loadAds() : void {
		this.listLoading = true;
		this.activeAdControllers = [];

		const offset = this.pageNumber * this.adsPerPage;
		const amountToLoad = Math.min(this.totalAdCount - offset, this.adsPerPage)

		for(let i = 0; i < amountToLoad; i++) {
			this.activeAdControllers.push(new AdController(this.rootStore));
		}

		window.setTimeout(async () => {
			const input = this.adFilterModel.toInput(offset, amountToLoad);

			try {

				const ads = await this.rootStore.services.adService.getAds(input);

				this.totalAdCount = ads.totalCount;

				for(let i = 0; i < amountToLoad; i++) {
					const ad = ads.data[i];
					this.activeAdControllers[i].load(ad);
				}
			} catch(error) {
				this.serverError(error);
			} finally {
				this.filterButtonState = "default";
				this.listLoading = false;
			}
		}, 20);
	}

	private resetScroll() : void {
		window.scrollTo(0, 0);
	}

	@action
	private serverError(error: any) : void {
		this.filterButtonState = "error";

		if(error instanceof HttpError) {
			this.pageError = error.error;
		} else {
			this.pageError = ErrorMessage.UNKNOWN;
			console.error(error);
		}
	}

	@action
	public async onFilter() : Promise<void> {
		await this.load();
	}

	@action
	public onFilterClear() : void {
		this.adFilterModel.clear();
	}

	@action
	public onChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) : void => {
		this.pageNumber = page;
		this.resetScroll();
		this.loadAds();
	}

	@action
	public onChangeFilter(key: keyof IAdFilterModel, value: any) : void {
		this.adFilterModel[key] = value;
	}

	@action
	public onCloseSnackbar() : void {
		this.pageError = "";
	}

	@action
	public onChangeAdsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) : void => {
		const newAdsPerPage = parseInt(event.target.value);

		this.resetScroll();

		if(newAdsPerPage > this.adsPerPage) {
			this.adsPerPage = newAdsPerPage;
			this.loadAds();
		} else {
			this.adsPerPage = newAdsPerPage;
			this.activeAdControllers.length = newAdsPerPage;
		}
	}
}
