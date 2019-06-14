import * as Koa from "koa";
import { Logger } from "../Logger";

export type ApiContext = Koa.ParameterizedContext<IApiState>;

export interface IApiState {
	session: ISession
	requestId: string
	logger: Logger
}

export interface ISession {
	userId: number
}