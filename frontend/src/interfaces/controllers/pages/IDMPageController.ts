import { IConversation } from "common-library";

export interface IDMPageController {
	readonly dmCount: number
	readonly dmsPerPage: number
	readonly pageNumber: number
	readonly convos: IConversation[]
	readonly selectedConvo?: IConversation

	selectConvo: (convo: IConversation) => void
	onNewDM: () => void
}