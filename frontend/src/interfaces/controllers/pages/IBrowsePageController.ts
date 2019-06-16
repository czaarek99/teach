import { IAdController } from "../IAdController";
import { Positioner, OnCellsRenderedCallback, CellMeasurerCache } from "react-virtualized";

export interface IOnCellsRenderedParams {
	stopIndex: number
	startIndex: number
}

export interface IBrowsePageController {
	readonly loading: boolean
	readonly cellCount: number
	readonly positioner: Positioner
	readonly cellCache: CellMeasurerCache


	onCellsRendered: (params: IOnCellsRenderedParams) => void
	getAdController(index: number) : IAdController

}