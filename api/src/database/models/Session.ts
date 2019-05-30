import { Table, Column, Model, CreatedAt, UpdatedAt, Unique, AllowNull, DataType } from "sequelize-typescript";

export interface ISession {
	userId: number
}

@Table({
    tableName: "sessions",
    timestamps: false
})

export class Session extends Model<Session> {

    @AllowNull(false)
    @Column
    public expirationDate: Date;

    @AllowNull(false)
    @Column(DataType.STRING(36))
    public key: string;

    @AllowNull(false)
    @Column(DataType.JSON)
    public session: ISession;

}