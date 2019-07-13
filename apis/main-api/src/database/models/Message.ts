import { Conversation } from "./Conversation";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	ForeignKey,
	BelongsTo,
	AutoIncrement,
	PrimaryKey,
	Unique,
} from "sequelize-typescript";

@Table
export class Message extends Model<Message> {

	@Unique
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER.UNSIGNED)
	public id: number;

	@BelongsTo(() => Conversation, "conversationId")
	public conversation: Conversation;

	@AllowNull(false)
	@ForeignKey(() => Conversation)
	@Column(DataType.INTEGER.UNSIGNED)
	public conversationId: number;

	@AllowNull(false)
	@Column(DataType.TEXT)
	public content: string;

}