import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { resolveTeacher } from "../util/resolveTeacher";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";

const router = Router();

router.get("/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async(context: CustomContext) => {

	const id = context.params.id;

	const user = await User.findOne<User>({
		where: {
			id
		},
		include: [
			Address,
			Image
		]
	});

	const teacher = resolveTeacher(user);

	context.body = teacher;
	context.status = 200;
})

export default router;
