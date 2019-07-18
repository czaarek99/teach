import { BaseService } from "./BaseService";
import { IDMService } from "../interfaces";
import { objectToParams } from "../util";

import {
	IDMListInput,
	IConversation,
	IEdge,
	INewConversationInput,
	INewDMInput
} from "common-library";

export class DMService extends BaseService implements IDMService {

	constructor() {
		super("/dm")
	}

	public async getDMS(input: IDMListInput) : Promise<IEdge<IConversation>> {
		const params = objectToParams(input);

		const response = await this.axios.get<IEdge<IConversation>>(
			`/list?${params}`
		);

		return response.data;
	}

	public async addConversation(input: INewConversationInput) : Promise<IConversation> {
		const response = await this.axios.put<IConversation>("/convo", input);
		return response.data;
	}

	public async addDM(input: INewDMInput) : Promise<void> {
		await this.axios.patch("/", input);
	}

}