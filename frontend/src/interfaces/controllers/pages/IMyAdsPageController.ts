import { IAdController } from "../IAdController";

export interface IMyAdsPageController {
	readonly adControllers: IAdController[]
	readonly loading: boolean
	readonly pageError: string

	onNewAd: () => void
}