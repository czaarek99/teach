import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { User } from "./models/User";

export const connection = new Sequelize({
	database: config.databaseName,
	username: config.databaseUser,
	password: config.databasePassword,
	host: config.databaseHost,
	dialect: "mariadb",
});

connection.addModels([
	User
]);