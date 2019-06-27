import { IAd } from "common-library";

export interface IAdController {
	readonly ad: IAd | null
	readonly controllerId: string

	onClick: () => void
	load: (ad: IAd) => void
}
