import { Ad } from "./Ad";

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

}