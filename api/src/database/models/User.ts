import { 
    Table, 
    Column, 
    Model, 
    CreatedAt, 
    UpdatedAt, 
    Unique, 
    AllowNull, 
    DataType 
} from "sequelize-typescript";

@Table({
    tableName: "users"
})
export class User extends Model<User> {

    @AllowNull(false)
    @Column(DataType.STRING(100))
    public firstName: string;

    @AllowNull(false)
    @Column(DataType.STRING(100))
    public lastName: string;

    @AllowNull(false)
    @Column(DataType.STRING(255))
    public email: string;

    @AllowNull(false)
    @Column(DataType.STRING(60))
    public password: string;

    @CreatedAt
    public creationDate: Date;

    @UpdatedAt
    public updatedOn: Date;
}