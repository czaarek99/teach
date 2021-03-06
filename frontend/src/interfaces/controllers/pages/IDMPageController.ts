import { IConversation } from "common-library";
import { IConversationController, INewConversationCreatorController } from "../conversation";

export interface IDMPageController {
	readonly dmCount: number
	readonly dmsPerPage: number
	readonly pageNumber: number
	readonly convos: IConversation[]
	readonly selectedConvo?: IConversation
	readonly newConvoController?: INewConversationCreatorController
	readonly oldConvoController?: IConversationController
	readonly errorMessage: string

	selectConvo: (convo: IConversation) => void
	onCloseSnackbar: () => void
	onNewDM: () => void
}