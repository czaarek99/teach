import { IDMModel } from "../../models";
import { IConversation } from "common-library";

export interface IConversationController {
	readonly convo: IConversation
	readonly model: IDMModel

	onChange: (key: keyof IDMModel, value: any) => void
	onSendMessage: () => Promise<void>
}