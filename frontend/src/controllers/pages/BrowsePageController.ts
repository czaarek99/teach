import { observable } from "mobx";
import { IAdController } from "../../interfaces/controllers/IAdController";

import { 
	IBrowsePageController 
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

export class BrowsePageController implements IBrowsePageController {

	private offset = 0;
	private adControllers : IAdController[] = [];

	@observable public loading = true;
	@observable public cellCount = 0;
	@observable public cellCache = new CellMeasurerCache({
		defaultWidth: AD_MAX_WIDTH,
		defaultHeight: ESTIMATED_AD_HEIGHT
	});

	@observable public positioner = createMasonryCellPositioner({
		cellMeasurerCache: this.cellCache,
		columnCount: 1,
		columnWidth: AD_MAX_WIDTH,
		spacer: 10
	});

	public getAdController(index: number) : IAdController {

	}

}