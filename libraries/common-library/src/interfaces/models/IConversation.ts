import { IMessage } from "./IMessage";
import { ITeacher } from "./ITeacher";

export interface IConversation {
	members: ITeacher[]
	messages: IMessage[]
	title: string
}