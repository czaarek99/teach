import { IConversationController } from "../interfaces/controllers/IConversationController";
import { IConversation } from "common-library";
import { RootStore } from "../stores/RootStore";
import { IDMModel } from "../interfaces/models/IDMModel";
import { observable } from "mobx";
import { DMModel } from "../models/DMModel";

export class ConversationController implements IConversationController {

	private readonly rootStore: RootStore;

	@observable public model = new DMModel();

	constructor(
		rootStore: RootStore,
		convo: IConversation
	) {
		this.rootStore = rootStore;
	}

	public onChange(key: keyof IDMModel, value: any) : void {

	}

	public async onSendMessage() : Promise<void> {

	}

}