import { IDMEditorController } from "../interfaces/controllers/IDMEditorController";
import { observable } from "mobx";
import { IConversation } from "common-library";
import { NewConversationModel } from "../models/NewConversationModel";
import { INewConversationModel } from "../interfaces/models/INewConversationModel";

export class DMEditorController implements IDMEditorController {

	@observable public readonly convo?: IConversation;
	@observable public newConversationModel = new NewConversationModel();

	constructor(convo?: IConversation) {
		this.convo = convo;
	}

	public onNewConversationChange(key: keyof INewConversationModel, value: any) : void {
		this.newConversationModel[key] = value;
	}

}