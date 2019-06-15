import { IAdController } from "../IAdController";
import { Positioner } from "react-virtualized";
import { CellMeasurerCacheInterface } from "react-virtualized/dist/es/CellMeasurer";

export interface IBrowsePageController {
	readonly loading: boolean
	readonly cellCount: number
	readonly positioner: Positioner
	readonly cellCache: CellMeasurerCacheInterface


	getAdController(index: number) : IAdController

}