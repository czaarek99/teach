import { User } from "./User";
import { UUID_V4_LENGTH } from "common-library";

import {
	Table,
	Column,
	Model,
	Unique,
	AllowNull,
	DataType,
	BelongsTo,
	ForeignKey
} from "sequelize-typescript";

@Table
export class PasswordReset extends Model<PasswordReset> {

	@BelongsTo(() => User, "userId")
	public user: User;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@AllowNull(false)
	@Unique
	@Column(DataType.STRING(UUID_V4_LENGTH))
	public resetKey: string;
}
