import { 
	Table, 
	Model, 
	Unique,
	AllowNull,
	Column,
	DataType,
	ForeignKey
} from "sequelize-typescript";
import { User } from "./User";

@Table
export class Image extends Model<Image> {

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@Unique
	@AllowNull(false)
	@Column
	public imageFileName: string;

}