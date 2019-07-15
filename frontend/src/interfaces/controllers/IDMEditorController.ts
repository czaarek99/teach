import { IConversation } from "common-library";
import { INewConversationModel } from "../models/INewConversationModel";
import { IDMModel } from "../models/IDMModel";

export interface IDMEditorController {
	readonly convo?: IConversation
	readonly newConversationModel: INewConversationModel
	readonly dmModel: IDMModel

	sendDM: () => Promise<void>
	onDMChange: (key: keyof IDMModel, value: any) => void
	onNewConversationChange: (key: keyof INewConversationModel, value: any) => void
}