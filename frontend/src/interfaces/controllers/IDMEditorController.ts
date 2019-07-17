import { IConversation, ITeacher } from "common-library";
import { INewConversationModel } from "../models/INewConversationModel";
import { IDMModel } from "../models/IDMModel";

export interface IDMEditorController {
	readonly convo?: IConversation
	readonly userSearchResult: ITeacher[]
	readonly newConversationModel: INewConversationModel
	readonly dmModel: IDMModel
	readonly showUserDropdown: boolean
	readonly dropdownMessage: string

	sendDM: () => Promise<void>
	onSearchInputClick: () => void
	onClickOutsideSearch: () => void
	onDMChange: (key: keyof IDMModel, value: any) => void
	onNewConversationChange: (key: keyof INewConversationModel, value: any) => void
}