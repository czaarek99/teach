import { User } from "./User";
import { SETTING_MAX_LENGTH, SettingKey } from "common-library";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	BelongsTo,
	ForeignKey,
} from "sequelize-typescript";

@Table
export class UserSetting extends Model<UserSetting> {

	@BelongsTo(() => User, "userId")
	public user: User

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@AllowNull(false)
	@Column(DataType.STRING)
	public key: SettingKey;

	@AllowNull(true)
	@Column(DataType.STRING(SETTING_MAX_LENGTH))
	public stringValue: string;

	@AllowNull(true)
	@Column(DataType.INTEGER)
	public integerValue: number;
}

