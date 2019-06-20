import { IAdController } from "../IAdController";

export interface IBrowsePageController {
	readonly pageLoading: boolean
	readonly listLoading: boolean
	readonly pageNumber: number
	readonly adsPerPage: number
	readonly totalAdCount: number
	readonly activeAdControllers: IAdController[]

	onChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void
    onChangeAdsPerPage: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
}