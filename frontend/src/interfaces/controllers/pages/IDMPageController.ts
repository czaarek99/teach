import { IConversation } from "common-library";
import { INewConversationCreatorController } from "../INewConversationCreatorController";
import { IConversationController } from "../IConversationController";

export interface IDMPageController {
	readonly dmCount: number
	readonly dmsPerPage: number
	readonly pageNumber: number
	readonly convos: IConversation[]
	readonly selectedConvo?: IConversation
	readonly newConvoController?: INewConversationCreatorController
	readonly oldConvoController?: IConversationController

	selectConvo: (convo: IConversation) => void
	onNewDM: () => void
}