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

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const info = await this.rootStore.services.adService.getAds({
			limit: 0,
			offset: 0
		});

		this.totalAdCount = info.totalCount;
		this.pageLoading = false;
		this.loadAds();
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
			const ads = await this.rootStore.services.adService.getAds(input);

			this.totalAdCount = ads.totalCount;

			for(let i = 0; i < amountToLoad; i++) {
				const ad = ads.data[i];
				this.activeAdControllers[i].load(ad);
			}

			this.listLoading = false;
		}, 20);
	}

	private resetScroll() : void {
		window.scrollTo(0, 0);
	}

	@action
	public onFilter() : void {
		this.pageNumber = 1;
		this.activeAdControllers = [];

		this.loadAds();
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
