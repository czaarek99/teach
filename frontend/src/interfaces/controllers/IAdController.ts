import { IAd } from "common-library";

export interface IAdController {
	readonly ad: IAd | null
	readonly controllerId: string
	readonly mainImage: string

	onClick: () => void
	load: (ad: IAd) => void
}
