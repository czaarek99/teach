import { User } from "./User";

import {
	Table,
	Model,
	Unique,
	AllowNull,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
	AutoIncrement
} from "sequelize-typescript";

@Table
export class Image extends Model<Image> {

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
	public userId: number

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

}