import {
	IPagination,
	IEdge,
	IAd,
	INewAdInput,
	ISimpleIdOutput
} from "common-library";

export interface IAdService  {
	getAds: (pagination: IPagination) => Promise<IEdge<IAd>>
	getAd: (id: number) => Promise<IAd>
	getMyAds: () => Promise<IEdge<IAd>>
	createAd: (newAd: INewAdInput) => Promise<ISimpleIdOutput>
	updateAd: (id: number, changes: Partial<INewAdInput>) => Promise<void>
}