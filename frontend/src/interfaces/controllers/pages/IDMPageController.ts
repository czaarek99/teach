import { IConversation } from "common-library";

export interface IDMPageController {
	readonly dmCount: number
	readonly dmsPerPage: number
	readonly pageNumber: number
	readonly convos: IConversation[]

	onNewDM: () => void
}