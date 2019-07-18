import { RootStore } from "../../stores";
import { DMPageController } from "../pages";
import { NewConversationModel } from "../../models";
import { observable, action } from "mobx";
import { ErrorModel, ValidatorMap, minLength, maxLength } from "../../validation";

import {
	ITeacher,
	IConversation,
	USER_SEARCH_MIN_LENGTH,
	CONVERSATION_TITLE_MAX_LENGTH,
	CONVERSATION_TITLE_MIN_LENGTH,
	DM_MAX_LENGTH,
	DM_MIN_LENGTH
} from "common-library";

import {
	INewConversationCreatorController,
	INewConversationModel,
	INewConversationCreatorErrorState
} from "../../interfaces";

export class NewConversationCreatorController implements INewConversationCreatorController {

	private readonly rootStore: RootStore;
	private readonly parent: DMPageController;
	private readonly validators : ValidatorMap<INewConversationModel> = {
		title: [
			minLength(CONVERSATION_TITLE_MIN_LENGTH),
			maxLength(CONVERSATION_TITLE_MAX_LENGTH)
		],
		message: [
			minLength(DM_MIN_LENGTH),
			maxLength(DM_MAX_LENGTH)
		]
	}


	private receiver?: ITeacher;
	private searchTimeout?: number

	@observable public readonly convo?: IConversation;
	@observable public model = new NewConversationModel();
	@observable public userSearchResult : ITeacher[] = [];
	@observable public showUserDropdown = false;
	@observable public dropdownMessage = "info.searchTooShort";
	@observable public errorModel = new ErrorModel<INewConversationCreatorErrorState>({
		title: [],
		message: [],
		receiver: []
	});

	constructor(
		rootStore: RootStore,
		parent: DMPageController
	) {
		this.rootStore = rootStore;
		this.parent = parent;
	}

	@action
	public onChange(key: keyof INewConversationModel, value: any) : void {
		this.model[key] = value;

		if(key === "receiver") {
			this.showUserDropdown = true;
			this.receiver = undefined;

			clearTimeout(this.searchTimeout);
			this.userSearchResult = [];

			this.dropdownMessage = "info.searchTooShort";

			if(value.length >= USER_SEARCH_MIN_LENGTH) {
				this.searchTimeout = window.setTimeout(async () => {
					this.dropdownMessage = "info.searching"

					const output = await this.rootStore.services.userService.searchUsers({
						search: value
					});

					if(output.length === 0) {
						this.dropdownMessage = "info.noUsers";
					} else {
						this.dropdownMessage = "";
					}

					this.userSearchResult = output;
				}, 500)
			}
		}
	}

	@action
	public onSelectUserToMessage(teacher: ITeacher) : void {
		this.onChange("receiver", teacher.firstName + " " + teacher.lastName);
		this.receiver = teacher;
		this.showUserDropdown = false;
	}

	@action
	public onClickOutsideSearch() : void {
		this.showUserDropdown = false;
	}

	@action
	public onSearchInputClick() : void {
		if(this.receiver === undefined) {
			this.showUserDropdown = true;
		}
	}

	@action
	public async startConversation() : Promise<void> {
		if(!this.errorModel.hasErrors()) {
			try {
				if(this.receiver) {
					const input = this.model.toInput(this.receiver);

					const convo = await this.rootStore.services.dmService.addConversation(input);
					this.parent.onFinishConversationCreation(convo);
				}

			} catch(error) {

			}
		}

	}

}