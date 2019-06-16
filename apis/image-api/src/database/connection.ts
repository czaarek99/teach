import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { UserImage } from "../../../main-api/src/database/models/Image";

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
		UserImage
	]);

	return connection;
}