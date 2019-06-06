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
		context.state.throwApiError(new HttpError(409, ErrorMessage.EMAIL_EXISTS, context.state.requestId));
		return;
	}

	const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

	const user = await User.create({
		email: body.email,
		password: hashedPassword,
		firstName: body.firstName,
		lastName: body.lastName
	});

	context.state.logger.info("User registration",  {
		userId: user.id
	});

	context.session.userId = user.id;
	context.status = 200;
});

function throwNoSuchUserError(context: CustomContext) {
	context.state.throwApiError(new HttpError(404, ErrorMessage.USER_NOT_FOUND, context.state.requestId));
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
		throwNoSuchUserError(context);
		return;
	}

	const isPasswordValid = await bcrypt.compare(body.password, user.password);

	if(!isPasswordValid) {
		throwNoSuchUserError(context);
		return;
	}

	context.state.logger.info("User login", {
		userId: user.id
	});

	context.session.userId = user.id;
	context.status = 200;
});

export default router;