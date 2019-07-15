import { IConversation } from "common-library";
import { IDMEditorController } from "../IDMEditorController";

export interface IDMPageController {
	readonly dmCount: number
	readonly dmsPerPage: number
	readonly pageNumber: number
	readonly convos: IConversation[]
	readonly selectedConvo?: IConversation
	readonly editorController: IDMEditorController

	selectConvo: (convo: IConversation) => void
	onNewDM: () => void
}