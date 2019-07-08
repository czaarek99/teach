import { User } from "./User";
import { AD_NAME_MAX_LENGTH, AdCategory } from "common-library";
import { AdImage } from "./AdImage";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	BelongsTo,
	ForeignKey,
	HasMany,
	Unique,
	PrimaryKey,
	AutoIncrement,
} from "sequelize-typescript";

@Table
export class Ad extends Model<Ad> {

	@Unique
	@PrimaryKey
	@AutoIncrement
	@Column(DataType.INTEGER.UNSIGNED)
	public id: number;

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

	@AllowNull(false)
	@Column
	public private: boolean;

	@AllowNull(false)
	@Column(DataType.STRING(100))
	public category: AdCategory;

	@HasMany(() => AdImage, {
		foreignKey: "adId",
		hooks: true,
		onDelete: "cascade",
		foreignKeyConstraint: true
	})
	public images: AdImage[];

}