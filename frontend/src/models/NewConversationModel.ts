import { INewConversationModel } from "../interfaces/models/INewConversationModel";
import { observable } from "mobx";
import { INewConversationInput, ITeacher } from "common-library";

export class NewConversationModel implements INewConversationModel {

	@observable public receiver = "";
	@observable public title = "";
	@observable public message = "";

	public toInput(teacher: ITeacher) : INewConversationInput {
		return {
			members: [teacher.id],
			firstMessage: this.message,
			title: this.title
		}
	}

}