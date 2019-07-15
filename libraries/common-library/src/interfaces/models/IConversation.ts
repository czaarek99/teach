import { IMessage } from "./IMessage";
import { ITeacher } from "./ITeacher";

export interface IConversation {
	id: number
	members: ITeacher[]
	messages: IMessage[]
	title: string
}