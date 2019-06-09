import * as Koa from "koa";
import { config } from "./config";

export class Server {

	public startServer() : void {
		const app = new Koa();

		app.listen(config.serverPort);
	}

}