import { IDMModel } from "../../models";

export interface IConversationController {
	readonly model: IDMModel

	onChange: (key: keyof IDMModel, value: any) => void
	onSendMessage: () => Promise<void>
}