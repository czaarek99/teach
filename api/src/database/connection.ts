import { Sequelize } from "sequelize-typescript";
import { config } from "../config";
import { User } from "./models/User";
import { Session } from "./models/Session";

export const connection = new Sequelize(
    config.databaseName, 
    config.databaseUser, 
    config.databasePassword, 
    {
        host: config.databaseHost,
        dialect: "mariadb"
    }
);

connection.addModels([
    User,
    Session
])