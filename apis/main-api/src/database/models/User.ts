import { Address } from "./Address";
import { PasswordReset } from "./PasswordReset";
import { Ad } from "./Ad";
import { UserSetting } from "./UserSetting";
import { ProfilePicture } from "./ProfilePicture";
import { Conversation } from "./Conversation";
import { ConversationUser } from "./ConversationUser";

import {
	Table,
	Column,
	Model,
	Unique,
	AllowNull,
	DataType,
	HasOne,
	PrimaryKey,
	AutoIncrement,
	HasMany,
	BelongsToMany,
} from "sequelize-typescript";

import {
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MAX_LENGTH,
	EMAIL_MAX_LENGTH,
	PHONE_NUMBER_MAX_LENGTH,
} from "common-library";

const PASSWORD_HASH_MAX_LENGTH = 60;

@Table
export class User extends Model<User> {

	@Unique
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER.UNSIGNED)
	public id: number;

	@AllowNull(false)
	@Column(DataType.STRING(FIRST_NAME_MAX_LENGTH))
	public firstName: string;

	@AllowNull(false)
	@Column(DataType.STRING(LAST_NAME_MAX_LENGTH))
	public lastName: string;

	@Unique
	@AllowNull(false)
	@Column(DataType.STRING(EMAIL_MAX_LENGTH))
	public email: string;

	@AllowNull(false)
	@Column(DataType.STRING(PASSWORD_HASH_MAX_LENGTH))
	public password: string;

	@AllowNull(false)
	@Column
	public birthDate: Date;

	@AllowNull(true)
	@Column(DataType.STRING(PHONE_NUMBER_MAX_LENGTH))
	public phoneNumber?: string

	@BelongsToMany(() => Conversation, () => ConversationUser)
	public conversations: Conversation[];

	@HasOne(() => ProfilePicture,  "userId")
	public profilePicture?: ProfilePicture;

	@HasOne(() => Address, "userId")
	public address: Address;

	@HasMany(() => PasswordReset, "userId")
	public passwordResets?: PasswordReset[]

	@HasMany(() => Ad, "userId")
	public ads?: Ad[]

	@HasMany(() => UserSetting, "userId")
	public settings: UserSetting[];
}
