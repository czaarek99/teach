import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { ISimpleGetInput, HttpError } from "common-library";
import { User } from "../database/models/User";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";
import { throwApiError } from "server-lib";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";

const router = Router();

router.get("/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async(context: CustomContext) => {

	const get = context.params as ISimpleGetInput;

	const user : User = await User.findOne<User>({
		where: {
			id: get.id
		},
		include: [
			Address,
			Image
		]
	});

	if(!user) {
		throwApiError(
			context,
			new HttpError(
				404
			)
		);

		return;
	}

	context.body = resolveTeacher(user);
	context.status = 200;
})

export default router;