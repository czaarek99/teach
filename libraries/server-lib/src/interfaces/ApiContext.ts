import * as Koa from "koa";
import { Logger } from "../Logger";

export type ApiContext<T = {}> = Koa.ParameterizedContext<IApiState & T>;

export interface IApiState {
	session: ISession
	requestId: string
	logger: Logger
}

export interface ISession {
	userId: number
}