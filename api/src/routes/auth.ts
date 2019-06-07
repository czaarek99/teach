import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";

import { Joi } from "koa-joi-router";
import { User } from "../database/models/User";
import { CustomContext } from "../Server";
import { addDays } from "date-fns";


import {
	HttpError,
	ErrorMessage,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	COUNTRY_CODE_LENGTH,
	EMAIL_MAX_LENGTH,
	EMAIL_MIN_LENGTH,
	STATE_MAX_LENGTH,
	STATE_MIN_LENGTH,
	getUserMaxDate,
} from "common-library";
import { Address } from "../database/models/Address";

const router = Router();

const SALT_ROUNDS = 10;

router.post("/register", {
	validate: {
		body: {
			email: Joi.string().min(EMAIL_MIN_LENGTH).max(EMAIL_MAX_LENGTH).required(),
			password: Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required(),
			firstName: Joi.string().min(FIRST_NAME_MIN_LENGTH).max(FIRST_NAME_MAX_LENGTH).required(),
			lastName: Joi.string().min(LAST_NAME_MIN_LENGTH).max(LAST_NAME_MAX_LENGTH).required(),
			birthDate: Joi.date().max(addDays(getUserMaxDate(), 3)).required(),
			address: Joi.object({
				street: Joi.string().min(STREET_MIN_LENGTH).max(STREET_MAX_LENGTH).required(),
				zipCode: Joi.string().min(ZIP_CODE_MIN_LENGTH).max(ZIP_CODE_MAX_LENGTH).required(),
				city: Joi.string().min(CITY_MIN_LENGTH).max(CITY_MAX_LENGTH).required(),
				countryCode: Joi.string().length(COUNTRY_CODE_LENGTH).required(),
				state: Joi.string().max(STATE_MAX_LENGTH).allow("").optional()
			}).requiredKeys("street", "zipCode", "city", "countryCode").optionalKeys("state")
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body;

	const emailValidation = Joi.string().email().validate(body.email);

	if(emailValidation.error !== null) {
		context.state.throwApiError(new HttpError(
			400,
			ErrorMessage.INVALID_EMAIL,
			context.state.requestId)
		);

		return;
	}

	const oldUser = await User.findOne({
		where: {
			email: body.email
		}
	});

	if(oldUser) {
		context.state.throwApiError(new HttpError(
			409,
			ErrorMessage.EMAIL_EXISTS,
			context.state.requestId)
		);
		return;
	}

	const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

	const address = body.address;

	const user = await User.create<User>({
		email: body.email,
		password: hashedPassword,
		firstName: body.firstName,
		lastName: body.lastName,
		birthDate: body.birthDate,
		address: {
			street: address.street,
			zipCode: address.zipCode,
			city: address.city,
			countryCode: address.countryCode
		}
	}, {
		include: [
			Address
		]
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
			email: Joi.string().max(EMAIL_MAX_LENGTH).required(),
			password: Joi.string().max(PASSWORD_MAX_LENGTH).required()
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