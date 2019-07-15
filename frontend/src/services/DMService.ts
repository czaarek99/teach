import { BaseService } from "./BaseService";
import { IDMService } from "../interfaces/services/IDMService";
import { IDMListInput, IConversation, IEdge, INewConversationInput } from "common-library";
import { objectToParams } from "../util/objectToParams";

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

}