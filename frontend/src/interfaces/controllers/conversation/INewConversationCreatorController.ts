import { ITeacher } from "common-library";
import { INewConversationModel } from "../../models";

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