import { INewConversationCreatorController } from "../interfaces/controllers/INewConversationCreatorController";
import { observable, action } from "mobx";
import { IConversation, USER_SEARCH_MIN_LENGTH, ITeacher } from "common-library";
import { NewConversationModel } from "../models/NewConversationModel";
import { INewConversationModel } from "../interfaces/models/INewConversationModel";
import { RootStore } from "../stores/RootStore";
import { DMPageController } from "./pages/DMPageController";

export class NewConversationCreatorController implements INewConversationCreatorController {

	private readonly rootStore: RootStore;
	private readonly parent: DMPageController;

	private receiver?: ITeacher;
	private searchTimeout?: number

	@observable public readonly convo?: IConversation;
	@observable public newConversationModel = new NewConversationModel();
	@observable public userSearchResult : ITeacher[] = [];
	@observable public showUserDropdown = false;
	@observable public dropdownMessage = "info.searchTooShort";

	constructor(
		rootStore: RootStore,
		parent: DMPageController
	) {
		this.rootStore = rootStore;
		this.parent = parent;
	}

	@action
	public onNewConversationChange(key: keyof INewConversationModel, value: any) : void {
		this.newConversationModel[key] = value;

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
		this.onNewConversationChange("receiver", teacher.firstName + " " + teacher.lastName);
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
		try {
			if(this.receiver) {
				const input = this.newConversationModel.toInput(this.receiver);

				const convo = await this.rootStore.services.dmService.addConversation(input);
			}

		} catch(error) {

		}
	}

}