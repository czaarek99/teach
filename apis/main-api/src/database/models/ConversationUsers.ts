import { Conversation } from "./Conversation";
import { User } from "./User";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	BelongsToMany,
	HasMany,
	ForeignKey,
} from "sequelize-typescript";

@Table
export class ConversationUsers extends Model<ConversationUsers> {

	@ForeignKey(() => User)
	@Column
	public userId: number;

	@ForeignKey(() => Conversation)
	@Column
	public conversationId: number;

}