import { User } from "./User";
import { Message } from "./Message";
import { CONVERSATION_TITLE_MAX_LENGTH } from "common-library";
import { ConversationUsers } from "./ConversationUsers";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	BelongsToMany,
	HasMany,
	ForeignKey,
	Unique,
	PrimaryKey,
	AutoIncrement,
} from "sequelize-typescript";

@Table
export class Conversation extends Model<Conversation> {

	@Unique
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER.UNSIGNED)
	public id: number;

	@BelongsToMany(() => User, () => ConversationUsers, "userId")
	public members: User[];

	@HasMany(() => Message, "conversationId")
	public messages: Message[];

	@AllowNull(false)
	@Column(DataType.STRING(CONVERSATION_TITLE_MAX_LENGTH))
	public title: string;
}

