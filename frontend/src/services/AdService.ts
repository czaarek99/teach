import { IAdService } from "../interfaces/services/IAdService";
import { BaseService } from "./BaseService";
import { IPagination, IEdge, IAd, INewAdInput } from "common-library";

export class AdService extends BaseService implements IAdService {

	constructor() {
		super("/ad")
	}

	public async getAds(pagination: IPagination) : Promise<IEdge<IAd>> {
		const params = new URLSearchParams();
		params.set("offset", pagination.offset.toString());
		params.set("limit", pagination.limit.toString());

		const response = await this.axios.get<IEdge<IAd>>(
			`/list?${params.toString()}`
		);

		return response.data;
	}

	public async getAd(id: number) : Promise<IAd> {
		const response = await this.axios.get<IAd>(`/${id}`);
		return response.data;
	}

	public async getMyAds() : Promise<IEdge<IAd>> {
		const response = await this.axios.get<IEdge<IAd>>("/my");
		return response.data;
	}

	public async createAd(input: INewAdInput) : Promise<void> {
		await this.axios.put("/", input);
	}

	public async updateAd(id: number, changes: Partial<INewAdInput>) : Promise<void> {
		await this.axios.patch("/" + id, changes);
	}

}