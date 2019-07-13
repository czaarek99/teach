import { IAdService } from "../interfaces/services/IAdService";
import { BaseService } from "./BaseService";

import {
	IEdge,
	IAd,
	ISimpleIdOutput,
	IEditAdInput,
	IAdListInput
} from "common-library";

export class AdService extends BaseService implements IAdService {

	constructor() {
		super("/ad")
	}

	public async getAds(input: IAdListInput) : Promise<IEdge<IAd>> {
		const params = new URLSearchParams();
		for(const [key, value] of Object.entries(input)) {
			if(value !== undefined && value !== null) {
				params.set(key, value);
			}
		}

		const response = await this.axios.get<IEdge<IAd>>(
			`/list?${params.toString()}`
		);

		return response.data;
	}

	public async getAd(id: number) : Promise<IAd> {
		const response = await this.axios.get<IAd>(`/single/${id}`);
		return response.data;
	}

	public async getMyAds() : Promise<IEdge<IAd>> {
		const response = await this.axios.get<IEdge<IAd>>("/my");
		return response.data;
	}

	public async createAd(input: IEditAdInput) : Promise<ISimpleIdOutput> {
		const response = await this.axios.put<ISimpleIdOutput>("/", input);
		return response.data;
	}

	public async updateAd(id: number, changes: Partial<IEditAdInput>) : Promise<void> {
		await this.axios.patch("/" + id, changes);
	}

	public async deleteAd(id: number) : Promise<void> {
		await this.axios.delete("/" + id);
	}

}