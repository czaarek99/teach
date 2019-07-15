import { INewConversationModel } from "../interfaces/models/INewConversationModel";
import { observable } from "mobx";

export class NewConversationModel implements INewConversationModel {

	@observable public receiver = "";
	@observable public title = "";

}