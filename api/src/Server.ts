import * as Koa from "koa";

export class Server {

	public startServer() : void {
		const app = new Koa();

		app.use((context: Koa.Context) => {
			context.body = "Hello world"
		});

		app.listen(3000);

	}

}
