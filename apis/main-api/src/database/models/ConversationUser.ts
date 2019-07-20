import { Conversation } from "./Conversation";
import { User } from "./User";

import {
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";

@Table
export class ConversationUser extends Model<ConversationUser> {

	@BelongsTo(() => Conversation, "conversationId")
	public conversation: Conversation;

	@BelongsTo(() => User, "userId")
	public user: User;

	@ForeignKey(() => User)
	@Column
	public userId: number;

	@ForeignKey(() => Conversation)
	@Column
	public conversationId: number;

}