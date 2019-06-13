import * as Router from "koa-joi-router";

import { join } from "path";
import { config } from "./config";
import { CustomContext } from "./Server";
import { Joi } from "koa-joi-router";
import { pathExists } from "fs-extra";
import { v4 } from "uuid";

const router = Router();

router.put("/", {
	validate: {
		type: "multipart"
	}
}, async (context: CustomContext) => {
	try {
		let part;

		while((part = await context.request.parts)) {

		}
	} catch(error) {

	}

	context.status = 200;
})
