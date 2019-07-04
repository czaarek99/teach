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
} from "sequelize-typescript";

@Table
export class ProfilePicture extends Model<ProfilePicture> {

	@BelongsTo(() => User, "userId")
	public user: User;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

}