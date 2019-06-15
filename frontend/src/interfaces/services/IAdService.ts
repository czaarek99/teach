import { IPagination, IEdge, IAd } from "common-library";

export interface IAdService  {
	getAds: (pagination: IPagination) => Promise<IEdge<IAd>>
	getAd: (id: number) => Promise<IAd>
}