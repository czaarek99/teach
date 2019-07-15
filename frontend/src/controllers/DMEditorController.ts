import { IDMEditorController } from "../interfaces/controllers/IDMEditorController";
import { observable } from "mobx";
import { IConversation } from "common-library";
import { NewConversationModel } from "../models/NewConversationModel";
import { INewConversationModel } from "../interfaces/models/INewConversationModel";
import { IDMModel } from "../interfaces/models/IDMModel";
import { DMModel } from "../models/DMModel";
import { RootStore } from "../stores/RootStore";

export class DMEditorController implements IDMEditorController {

	private readonly rootStore: RootStore;

	@observable public readonly convo?: IConversation;
	@observable public newConversationModel = new NewConversationModel();
	@observable public dmModel : DMModel;

	constructor(
		rootStore: RootStore,
		convo?: IConversation
	) {
		this.rootStore = rootStore;
		this.dmModel = new DMModel(convo);
		this.convo = convo;
	}

	public onNewConversationChange(key: keyof INewConversationModel, value: any) : void {
		this.newConversationModel[key] = value;
	}

	public onDMChange(key: keyof IDMModel, value: any) : void {
		this.dmModel[key] = value;
	}

	public async sendDM() : Promise<void> {

	}

}