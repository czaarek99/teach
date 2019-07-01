import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { User } from "./models/User";
import { Address } from "./models/Address";
import { PasswordReset } from "./models/PasswordReset";
import { Ad } from "./models/Ad";
import { Image } from "./models/Image";
import { UserSetting } from "./models/UserSetting";

export function connectToDatabase() : Sequelize {
	const connection = new Sequelize({
		database: config.databaseName,
		username: config.databaseUser,
		password: config.databasePassword,
		host: config.databaseHost,
		port: config.databasePort,
		dialect: "mariadb",
	});

	connection.addModels([
		User,
		Address,
		PasswordReset,
		Ad,
		Image,
		UserSetting
	]);

	return connection;
}

