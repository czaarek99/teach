import { User } from "./User";
import { AD_NAME_MAX_LENGTH, IAd } from "common-library";
import { Image } from "./Image";

import {
	Table,
	Column,
	Model,
	Unique,
	AllowNull,
	DataType,
	BelongsTo,
	ForeignKey,
	HasOne
} from "sequelize-typescript";

@Table
export class Ad extends Model<Ad> {

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

	@HasOne(() => Image, "id")
	public mainImage: Image;

}