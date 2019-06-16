import { 
	Table, 
	Model, 
	Unique,
	AllowNull,
	Column,
	DataType,
	ForeignKey
} from "sequelize-typescript";

@Table
export class Image extends Model<Image> {

	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	public parentId: number;

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

}