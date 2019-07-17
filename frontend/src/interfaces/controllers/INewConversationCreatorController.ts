import { INewConversationModel } from "../models/INewConversationModel";
import { ITeacher } from "common-library";

export interface INewConversationCreatorController {
	readonly userSearchResult: ITeacher[]
	readonly newConversationModel: INewConversationModel
	readonly showUserDropdown: boolean
	readonly dropdownMessage: string

	startConversation: () => Promise<void>
	onSearchInputClick: () => void
	onClickOutsideSearch: () => void
	onSelectUserToMessage: (teacher: ITeacher) => void
	onNewConversationChange: (key: keyof INewConversationModel, value: any) => void
}