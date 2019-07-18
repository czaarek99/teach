import { ITeacher } from "common-library";
import { INewConversationModel } from "../../models";
import { ErrorState, ErrorModel } from "../../../validation";

export interface INewConversationCreatorErrorState extends ErrorState {
	title: string[]
	message: string[]
	receiver: string[]
}

export interface INewConversationCreatorController {
	readonly userSearchResult: ITeacher[]
	readonly model: INewConversationModel
	readonly errorModel: ErrorModel<INewConversationCreatorErrorState>
	readonly showUserDropdown: boolean
	readonly dropdownMessage: string
	readonly errorMessage: string

	onStartConversation: () => Promise<void>
	onRetryStartConversation: () => Promise<void>
	onCloseSnackbar: () => void
	onSearchInputClick: () => void
	onClickOutsideSearch: () => void
	onSelectUserToMessage: (teacher: ITeacher) => void
	onChange: (key: keyof INewConversationModel, value: any) => void
}