import { IDMModel } from "../interfaces/models/IDMModel";
import { observable } from "mobx";
import { INewDMInput, IConversation } from "common-library";

export class DMModel implements IDMModel {

	private readonly conversationId? : number;

	@observable public message = "";

	constructor(convo?: IConversation) {
		if(convo) {
			this.conversationId = convo.id;
		}
	}

	public toInput() : INewDMInput {
		if(this.conversationId === undefined) {
			throw new Error("Conversation id is undefined")
		}

		return {
			conversationId: this.conversationId,
			message: this.message
		}
	}

}