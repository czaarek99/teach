import { Conversation } from "./Conversation";
import { User } from "./User";

import {
	Table,
	Column,
	Model,
	ForeignKey,
} from "sequelize-typescript";

@Table
export class ConversationUser extends Model<ConversationUser> {

	@ForeignKey(() => User)
	@Column
	public userId: number;

	@ForeignKey(() => Conversation)
	@Column
	public conversationId: number;

}