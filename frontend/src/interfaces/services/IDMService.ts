import {
	IDMListInput,
	IConversation,
	IEdge,
	INewConversationInput,
	INewDMInput
} from "common-library";

export interface IDMService {
	getDMS: (input: IDMListInput) => Promise<IEdge<IConversation>>
	addConversation: (input: INewConversationInput) => Promise<IConversation>
	addDM: (input: INewDMInput) => Promise<void>
}