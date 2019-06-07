import { User } from "./User";

import {
	Table,
	Column,
	Model,
	AllowNull,
	DataType,
	ForeignKey,
	BelongsTo
} from "sequelize-typescript";

import {
	IAddress,
	STREET_MAX_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	CITY_MAX_LENGTH,
	COUNTRY_CODE_LENGTH,
	STATE_MAX_LENGTH
} from "common-library";

@Table
export class Address extends Model<Address> implements IAddress {

	@BelongsTo(() => User, "userId")
	public user: User;

	@AllowNull(false)
	@ForeignKey(() => User)
	@Column(DataType.INTEGER.UNSIGNED)
	public userId: number;

	@AllowNull(false)
	@Column(DataType.STRING(STREET_MAX_LENGTH))
	public street: string;

	@AllowNull(false)
	@Column(DataType.STRING(ZIP_CODE_MAX_LENGTH))
	public zipCode: string

	@AllowNull(false)
	@Column(DataType.STRING(CITY_MAX_LENGTH))
	public city: string;

	@AllowNull(false)
	@Column(DataType.STRING(COUNTRY_CODE_LENGTH))
	public countryCode: string;

	@AllowNull(true)
	@Column(DataType.STRING(STATE_MAX_LENGTH))
	public state: string;

}