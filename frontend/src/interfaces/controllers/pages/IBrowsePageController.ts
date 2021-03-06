import { IAdFilterModel } from "../../models";
import { LoadingButtonState } from "../../../components";
import { IAdController } from "../IAdController";

export interface IBrowsePageController {
	readonly pageLoading: boolean
	readonly listLoading: boolean
	readonly pageNumber: number
	readonly adsPerPage: number
	readonly totalAdCount: number
	readonly activeAdControllers: IAdController[]
	readonly adFilterModel: IAdFilterModel
	readonly filterLoading: boolean
	readonly pageError: string
	readonly filterButtonState: LoadingButtonState

	onCloseSnackbar: () => void
	onFilterClear: () => void
	onFilter: () => Promise<void>
	onChangeFilter: (key: keyof IAdFilterModel, value: any) => void
	onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
	onChangeAdsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}