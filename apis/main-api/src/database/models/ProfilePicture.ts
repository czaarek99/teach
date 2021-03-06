import { User } from "./User";
import { unlink } from "fs-extra";
import { join } from "path";
import { config } from "../../config";

import {
	Table,
	Model,
	Unique,
	AllowNull,
	Column,
	DataType,
	ForeignKey,
	BelongsTo,
	BeforeDestroy,
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

	@BeforeDestroy
	public static destroyPicture(picture: ProfilePicture) : void {
		const path = join(config.userImagesPath, picture.imageFileName);
		unlink(path);
	}

}