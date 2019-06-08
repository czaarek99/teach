import { User } from "./User";

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
	@Column(DataType.STRING(36))
	public resetKey: string;
}
