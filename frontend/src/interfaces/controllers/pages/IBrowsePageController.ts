import { IAdController } from "../IAdController";
import { IAdFilterModel } from "../../models/IAdFilterModel";
import { LoadingButtonState } from "../../../components";

export interface IBrowsePageController {
	readonly pageLoading: boolean
	readonly listLoading: boolean
	readonly pageNumber: number
	readonly adsPerPage: number
	readonly totalAdCount: number
	readonly activeAdControllers: IAdController[]
	readonly adFilterModel: IAdFilterModel
	readonly filterLoading: boolean
	readonly filterButtonState: LoadingButtonState

	onFilterClear: () => void
	onFilter: () => void
	onChangeFilter: (key: keyof IAdFilterModel, value: any) => void
	onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
	onChangeAdsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}