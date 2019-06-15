import { User } from "./User";
import { AD_NAME_MAX_LENGTH, IAd } from "common-library";

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
export class Ad extends Model<Ad> implements IAd {

	@BelongsTo(() => User, "userId")
	public user: User;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@AllowNull(false)
	@Column(DataType.STRING(AD_NAME_MAX_LENGTH))
	public name: string;

	@AllowNull(false)
	@Column(DataType.TEXT)
	public description: string;

	@AllowNull(true)
	@Unique
	@Column
	public imageFileName?: string;

}