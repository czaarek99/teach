import { observable, action } from "mobx";
import { IConversation, HttpError, ErrorMessage } from "common-library";
import { RootStore } from "../../stores";
import { NewConversationCreatorController, ConversationController } from "../conversation";
import { requireLogin } from "../../util";

import {
	IDMPageController,
	INewConversationCreatorController,
	IConversationController
} from "../../interfaces";

export class DMPageController implements IDMPageController {

	@observable private readonly rootStore: RootStore;
	@observable public readonly dmsPerPage = 20;
	@observable public pageNumber = 0;
	@observable public dmCount = 0;
	@observable public convos: IConversation[] = []
	@observable public newConvoController?: INewConversationCreatorController;
	@observable public oldConvoController?: IConversationController;
	@observable public errorMessage = "";

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const isLoggedIn = await requireLogin(this.rootStore);

		if(!isLoggedIn) {
			return;
		}

		try {
			const dms = await this.rootStore.services.dmService.getDMS({
				offset: 0,
				limit: 0
			});

			this.dmCount = dms.totalCount;

			if(dms.totalCount === 0) {
				this.onNewDM();
			} else {
				const offset = this.pageNumber * this.dmsPerPage;
				const amountToLoad = Math.min(this.dmCount - offset, this.dmsPerPage)

				const convos = await this.rootStore.services.dmService.getDMS({
					offset,
					limit: amountToLoad
				});

				this.convos = convos.data;
			}
		} catch(error) {
			this.serverError(error);
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
	public onNewDM() : void {
		this.newConvoController = new NewConversationCreatorController(this.rootStore, this);
	}

	@action
	public selectConvo(convo: IConversation) : void {
		this.oldConvoController = new ConversationController(this.rootStore, convo);
	}

	@action
	public onFinishConversationCreation(convo: IConversation) : void {
		this.convos.unshift(convo);
		this.selectConvo(convo);
	}

}