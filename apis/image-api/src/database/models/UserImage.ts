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

	@AllowNull(false)
	@Unique
	public imageFileName: string;

	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

}