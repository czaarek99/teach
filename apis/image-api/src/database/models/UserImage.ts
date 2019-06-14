import { 
	Table, 
	Model, 
	Unique,
	AllowNull,
	Column,
	DataType
} from "sequelize-typescript";

@Table
export class UserImage extends Model<UserImage> {

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

}