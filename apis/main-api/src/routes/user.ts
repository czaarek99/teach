import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { ITeacher } from "common-library";
import { differenceInYears } from "date-fns";

const router = Router();

function resolveUser(user: User) : ITeacher {
	const now = new Date();

	const age = differenceInYears(now, user.birthDate);

	let avatarFileName = null;
	if(user.profilePicture) {
		avatarFileName = user.profilePicture.imageFileName;
	}

	return {

	}
}

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
		}
	});

})

export default router;
