import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { resolveTeacher } from "../util/resolveTeacher";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";
import { authenticationMiddleware } from "server-lib";
import { ITeacher } from "common-library";

const router = Router();

async function getTeacher(id: number) : Promise<ITeacher> {
	const user = await User.findOne<User>({
		where: {
			id
		},
		include: [
			Address,
			Image
		]
	});

	return resolveTeacher(user);
}

router.get("/self", {}, authenticationMiddleware, async (context: CustomContext) => {
	context.body = await getTeacher(context.state.session.userId);
	context.status = 200;
});

router.get("/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async(context: CustomContext) => {
	context.body = await getTeacher(context.params.id);
	context.status = 200;
});

export default router;
