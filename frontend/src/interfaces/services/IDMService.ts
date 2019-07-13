import { IDMListInput, IConversation, IEdge } from "common-library";

export interface IDMService {
	getDMS: (input: IDMListInput) => Promise<IEdge<IConversation>>
}