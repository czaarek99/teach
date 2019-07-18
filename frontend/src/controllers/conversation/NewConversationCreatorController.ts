import { RootStore } from "../../stores";
import { DMPageController } from "../pages";
import { NewConversationModel } from "../../models";
import { observable, action } from "mobx";
import { ErrorModel, ValidatorMap, minLength, maxLength, ValidationResult, validate } from "../../validation";

import {
	ITeacher,
	IConversation,
	USER_SEARCH_MIN_LENGTH,
	CONVERSATION_TITLE_MAX_LENGTH,
	CONVERSATION_TITLE_MIN_LENGTH,
	DM_MAX_LENGTH,
	DM_MIN_LENGTH,
	HttpError,
	ErrorMessage
} from "common-library";

import {
	INewConversationCreatorController,
	INewConversationModel,
	INewConversationCreatorErrorState
} from "../../interfaces";
import { objectKeys } from "../../util";

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
		],
		receiver: [
			this.receiverValidator.bind(this)
		]
	}


	private receiver?: ITeacher;
	private searchTimeout?: number

	@observable public readonly convo?: IConversation;
	@observable public model = new NewConversationModel();
	@observable public userSearchResult : ITeacher[] = [];
	@observable public showUserDropdown = false;
	@observable public dropdownMessage = "info.searchTooShort";
	@observable public errorMessage = "";
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

	private receiverValidator() : ValidationResult {
		if(!this.receiver) {
			return ErrorMessage.CONVERSATION_PLEASE_PICK_A_RECEIVER;
		}

		return null;
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
					await this.userSearch(value);
				}, 500)
			}
		}
	}

	@action
	private async userSearch(search: string) : Promise<void> {
		try {
			this.dropdownMessage = "info.searching"

			const output = await this.rootStore.services.userService.searchUsers({
				search
			});

			if(output.length === 0) {
				this.dropdownMessage = "info.noUsers";
			} else {
				this.dropdownMessage = "";
			}

			this.userSearchResult = output;
		} catch(error) {
			this.serverError(error);
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
	private serverError(error: any) : void {
		if(error instanceof HttpError) {
			this.errorMessage = error.error;
		} else {
			console.error(error);
			this.errorMessage = ErrorMessage.COMPONENT;
		}
	}

	@action
	public onCloseSnackbar() : void {
		this.errorMessage = "";
	}

	@action
	public async onRetryStartConversation() : Promise<void> {
		this.onCloseSnackbar();
		await this.onStartConversation();
	}

	@action
	private validate(key: keyof INewConversationModel) : void {
		const keyValidators = this.validators[key];

		if(keyValidators !== undefined) {
			const value = this.model[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}

	@action
	public async onStartConversation() : Promise<void> {
		for(const key of objectKeys(this.model.toValidate())) {
			this.validate(key);
		}

		if(!this.errorModel.hasErrors()) {
			try {
				if(this.receiver) {
					const input = this.model.toInput(this.receiver);

					const convo = await this.rootStore.services.dmService.addConversation(input);
					this.parent.onFinishConversationCreation(convo);
				}

			} catch(error) {
				this.serverError(error);
			}
		}
	}

}