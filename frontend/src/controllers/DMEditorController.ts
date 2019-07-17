import { IDMEditorController } from "../interfaces/controllers/IDMEditorController";
import { observable, action } from "mobx";
import { IConversation, USER_SEARCH_MIN_LENGTH, ITeacher } from "common-library";
import { NewConversationModel } from "../models/NewConversationModel";
import { INewConversationModel } from "../interfaces/models/INewConversationModel";
import { IDMModel } from "../interfaces/models/IDMModel";
import { DMModel } from "../models/DMModel";
import { RootStore } from "../stores/RootStore";

export class DMEditorController implements IDMEditorController {

	private readonly rootStore: RootStore;
	private searchTimeout?: number

	@observable public readonly convo?: IConversation;
	@observable public newConversationModel = new NewConversationModel();
	@observable public userSearchResult : ITeacher[] = [];
	@observable public dmModel : DMModel;
	@observable public showUserDropdown = false;
	@observable public dropdownMessage = "info.searchTooShort";

	constructor(
		rootStore: RootStore,
		convo?: IConversation
	) {
		this.rootStore = rootStore;
		this.dmModel = new DMModel(convo);
		this.convo = convo;
	}

	@action
	public onNewConversationChange(key: keyof INewConversationModel, value: any) : void {
		this.newConversationModel[key] = value;

		if(key === "receiver") {
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
	public onClickOutsideSearch() : void {
		this.showUserDropdown = false;
	}

	@action
	public onSearchInputClick() : void {
		this.showUserDropdown = true;
	}

	@action
	public onDMChange(key: keyof IDMModel, value: any) : void {
		this.dmModel[key] = value;
	}

	@action
	public async sendDM() : Promise<void> {
		try {
			const input = this.dmModel.toInput();

			await this.rootStore.services.dmService.addDM(input);

			if(this.convo) {
				this.convo.messages.push({
					content: input.message,
					sendDate: new Date()
				});

				this.dmModel = new DMModel(this.convo);
			}

		} catch(error) {

		}
	}

}