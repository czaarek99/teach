import { IConversation } from "common-library";
import { IConversationController } from "../conversation/IConversationController";
import { INewConversationCreatorController } from "../conversation/INewConversationCreatorController";

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