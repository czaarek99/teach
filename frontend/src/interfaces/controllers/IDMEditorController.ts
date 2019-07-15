import { IConversation } from "common-library";
import { INewConversationModel } from "../models/INewConversationModel";

export interface IDMEditorController {
	readonly convo?: IConversation
	readonly newConversationModel: INewConversationModel

	onNewConversationChange: (key: keyof INewConversationModel, value: any) => void
}