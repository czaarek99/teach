import * as Koa from "koa";
import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";
import { Joi } from "koa-joi-router";
import { User } from "../database/models/User";
import { CustomContext } from "../Server";
import { HttpError, ErrorMessage } from "common-library";

const router = Router();

const SALT_ROUNDS = 10;

router.post("/register", {
	validate: {
		body: {
			email: Joi.string().email(),
			password: Joi.string().min(10),
			firstName: Joi.string().min(1).max(200),
			lastName: Joi.string().min(1).max(201)
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body;

	const oldUser = User.findOne({
		where: {
			email: body.email
		}
	});

	if(oldUser) {
		throw new HttpError(409, ErrorMessage.EMAIL_EXISTS);
	}

	const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

	const user = await User.create({
		email: body.email,
		password: hashedPassword,
		firstName: body.firstName,
		lastName: body.lastName
	});

	context.state.logger.info(`Just registered a user with id: ${user.id}`);

	context.session.userId = user.id;
	context.response.status = 200;
});

function throwNoSuchUserError() {
	throw new HttpError(404, ErrorMessage.USER_NOT_FOUND)
}

router.post("/login", {
	validate: {
		body: {
			email: Joi.string(),
			password: Joi.string()
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body;

	const user = await User.findOne({
		where: {
			email: body.email
		}
	});

	if(!user) {
		throwNoSuchUserError();
	}

	const isPasswordValid = await bcrypt.compare(body.password, user.password);

	if(!isPasswordValid) {
		throwNoSuchUserError();
	}

	context.state.logger.info(`User with id: ${user.id} just logged in`);

	context.session.userId = user.id;
	context.response.status = 200;
});

export default router;