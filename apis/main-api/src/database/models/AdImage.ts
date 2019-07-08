import { Ad } from "./Ad";
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
export class AdImage extends Model<AdImage> {

	@BelongsTo(() => Ad, "adId")
	public ad: Ad;

	@AllowNull(false)
	@ForeignKey(() => Ad)
	@Column(DataType.INTEGER.UNSIGNED)
	public adId: number;

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	public index: number;

	@BeforeDestroy
	public static destroyImage(image: AdImage) : void {
		const path = join(config.userImagesPath, image.imageFileName);
		unlink(path);
	}

}