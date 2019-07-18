import { IConversation } from "common-library";
import { RootStore } from "../../stores";
import { DMModel } from "../../models";
import { IConversationController, IDMModel } from "../../interfaces";
import { observable } from "mobx";

export class ConversationController implements IConversationController {

	private readonly rootStore: RootStore;

	@observable public model = new DMModel();
	@observable public convo: IConversation;

	constructor(
		rootStore: RootStore,
		convo: IConversation
	) {
		this.rootStore = rootStore;
		this.convo = convo;
	}

	public onChange(key: keyof IDMModel, value: any) : void {

	}

	public async onSendMessage() : Promise<void> {

	}

}