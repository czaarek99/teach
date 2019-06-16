import { observable } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";
import { IAdService } from "../../interfaces/services/IAdService";
import { AdController } from "../AdController";

import { 
	IBrowsePageController, IOnCellsRenderedParams 
} from "../../interfaces/controllers/pages/IBrowsePageController";

import { 
	createMasonryCellPositioner, 
	CellMeasurerCache 
} from "react-virtualized";

import { 
	AD_MAX_WIDTH, 
	ESTIMATED_AD_HEIGHT 
} from "../../components";

const REQUEST_LIMIT = 500;
const OVERSCAN = 50;

export class BrowsePageController implements IBrowsePageController {

	private readonly adService: IAdService;
	private adControllers : IAdController[] = [];
	private loadedIndex = 0;

	@observable public loading = true;
	@observable public cellCount = 0;
	@observable public cellCache = new CellMeasurerCache({
		defaultWidth: AD_MAX_WIDTH,
		defaultHeight: ESTIMATED_AD_HEIGHT
	});

	//Measure height before doing this
	@observable public positioner = createMasonryCellPositioner({
		cellMeasurerCache: this.cellCache,
		columnCount: 1,
		columnWidth: AD_MAX_WIDTH,
		spacer: 10
	});

	constructor(adService: IAdService) {
		this.adService = adService;

		this.load();
	}


	private async load() : Promise<void> {
		const info = await this.adService.getAds({
			limit: 0,
			offset: 0
		});

		this.cellCount = info.totalCount;
		this.loading = false;
	}

	public onCellsRendered = (params: IOnCellsRenderedParams) : void => {
		if(params.stopIndex > this.loadedIndex - OVERSCAN)  {
			const offset = this.loadedIndex;
			this.loadedIndex += REQUEST_LIMIT;

			setTimeout(async () => {
				const ads = await this.adService.getAds({
					limit: REQUEST_LIMIT,
					offset,
				});

				for(let i = 0; i < ads.data.length; i++) {
					const ad = ads.data[i];
					const index = offset + i;

					if(!this.adControllers[index]) {
						this.adControllers[index] = new AdController();
					}  

					this.adControllers[index].load(ad);
				}
			}, 1)

		}
	}

	public getAdController(index: number) : IAdController {
		if(!this.adControllers[index]) {
			this.adControllers[index] = new AdController();
		}  

		const adController = this.adControllers[index];
		return adController;
	}

}