import * as Router from "koa-joi-router";
import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";
import { authenticationMiddleware } from "server-lib";
import { IUser } from "common-library";
import { resolveUser } from "../database/resolvers/resolveUser";

const router = Router();

router.get("/self", authenticationMiddleware, async (context: CustomContext) => {

	const user : User = await User.findOne<User>({
		where: {
			id: context.state.session.userId
		},
		include: [
			Address,
			Image
		]
	});

	context.body = resolveUser(user);
	context.status = 200;
});

export default router;
