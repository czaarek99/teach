import {
	IPagination,
	IEdge,
	IAd,
	ISimpleIdOutput,
	IEditAdInput,
	IAdListInput
} from "common-library";

export interface IAdService  {
	getAds: (pagination: IAdListInput) => Promise<IEdge<IAd>>
	getAd: (id: number) => Promise<IAd>
	getMyAds: () => Promise<IEdge<IAd>>
	createAd: (newAd: IEditAdInput) => Promise<ISimpleIdOutput>
	updateAd: (id: number, changes: Partial<IEditAdInput>) => Promise<void>
	deleteAd: (id: number) => Promise<void>
}