import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { User } from "./models/User";
import { Address } from "./models/Address";
import { PasswordReset } from "./models/PasswordReset";

export function connectToDatabase() : Sequelize {
	const connection = new Sequelize({
		database: config.databaseName,
		username: config.databaseUser,
		password: config.databasePassword,
		host: config.databaseHost,
		dialect: "mariadb",
	});

	connection.addModels([
		User,
		Address,
		PasswordReset
	]);

	return connection;
}

