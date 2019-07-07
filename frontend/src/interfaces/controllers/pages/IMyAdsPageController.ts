import { IAdController } from "../IAdController";

export interface IMyAdsPageController {
	readonly adControllers: IAdController[]
	readonly loading: boolean
	readonly pageError: string
	readonly canAdd: boolean

	onNewAd: () => void
}