import { IDMListInput, IConversation, IEdge, INewConversationInput } from "common-library";

export interface IDMService {
	getDMS: (input: IDMListInput) => Promise<IEdge<IConversation>>
	addConversation: (input: INewConversationInput) => Promise<IConversation>
}