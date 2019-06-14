import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";

import { Joi } from "koa-joi-router";
import { User } from "../database/models/User";
import { CustomContext } from "../Server";
import { addDays } from "date-fns";
import { Address } from "../database/models/Address";
import { PasswordReset } from "../database/models/PasswordReset";
import { v4 } from "uuid";
import { isBefore, subDays } from "date-fns";
import { randomBytes } from "crypto";
import { IRedisSession, getNewExpirationDate, throwApiError } from "server-lib";

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
	getUserMaxDate,
	DOMAIN,
	IForgot,
	IResetPassword,
	PHONE_NUMBER_MAX_LENGTH,
	SESSION_COOKIE_NAME,
} from "common-library";

import {
	PASSWORD_RESET_TEMPLATE,
	renderTemplate,
	PASSWORD_RESET_HELP_TEMPLATE
} from "../email/templates/templates";
import { verifyRecaptcha } from "../util/verifyRecaptcha";

const router = Router();

const SALT_ROUNDS = 10;
const SIMPLE_EMAIL_VALIDATOR = Joi.string().min(EMAIL_MIN_LENGTH).max(EMAIL_MAX_LENGTH).required();
const PASSWORD_VALIDATOR = Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).required();

async function hashPassword(password: string) : Promise<string> {
	return await bcrypt.hash(password, SALT_ROUNDS);
}

async function logIn(context: CustomContext, userId: number) : Promise<void> {
	const sessionId = await randomBytes(128).toString("hex");

	await context.state.redisClient.setJSONObject<IRedisSession>(sessionId, {
		userId,
		expirationDate: getNewExpirationDate()
	});

	context.cookies.set(SESSION_COOKIE_NAME, sessionId);
}

function validateEmail(context: CustomContext, email: string) : boolean {
	const emailValidation = Joi.string().email().validate(email);

	if(emailValidation.error !== null) {
		throwApiError(context, new HttpError(
				400,
				ErrorMessage.INVALID_EMAIL,
				context.state.requestId
			)
		);

		return false;
	}

	return true;
}

router.post("/register", {
	validate: {
		body: {
			email: SIMPLE_EMAIL_VALIDATOR,
			captcha: Joi.string(),
			password: PASSWORD_VALIDATOR,
			repeatPassword: Joi.string(),
			firstName: Joi.string().min(FIRST_NAME_MIN_LENGTH).max(FIRST_NAME_MAX_LENGTH).required(),
			lastName: Joi.string().min(LAST_NAME_MIN_LENGTH).max(LAST_NAME_MAX_LENGTH).required(),
			birthDate: Joi.date().max(addDays(getUserMaxDate(), 3)).required(),
			phoneNumber: Joi.string().max(PHONE_NUMBER_MAX_LENGTH).optional(),
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

	const captchaResult = await verifyRecaptcha(context, body.captcha);
	if(!captchaResult) {
		return;
	}

	if(!validateEmail(context, body.email)) {
		return;
	}

	if(body.password === body.email) {
		throwApiError(context, new HttpError(
				400,
				ErrorMessage.PASSWORD_AND_EMAIL_SAME,
				context.state.requestId
			)
		)
		return;
	}

	const oldUser = await User.findOne({
		where: {
			email: body.email
		}
	});

	if(oldUser) {
		throwApiError(context, new HttpError(
				409,
				ErrorMessage.EMAIL_EXISTS,
				context.state.requestId
			)
		);
		return;
	}

	const hashedPassword = await hashPassword(body.password);

	const address = body.address;

	const user = await User.create<User>({
		email: body.email,
		password: hashedPassword,
		firstName: body.firstName,
		lastName: body.lastName,
		birthDate: body.birthDate,
		phoneNumber: body.phoneNumber,
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

	await logIn(context, user.id);

	context.status = 200;
});

function throwNoSuchUserError(context: CustomContext) {
	throwApiError(context, new HttpError(404, ErrorMessage.USER_NOT_FOUND, context.state.requestId));
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

	const user = await User.findOne<User>({
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


	await logIn(context, user.id);

	context.status = 200;
});

router.post("/forgot", {
	validate: {
		body: {
			email: SIMPLE_EMAIL_VALIDATOR,
			captcha: Joi.string()
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body as IForgot;

	if(!validateEmail(context, body.email)) {
		return;
	}

	const captchaResult = await verifyRecaptcha(context, body.captcha);
	if(!captchaResult) {
		return;
	}

	const user = await User.findOne<User>({
		where: {
			email: body.email
		}
	});

	let html;

	if(user) {
		const resetKey = v4();

		await PasswordReset.create<PasswordReset>({
			userId: user.id,
			resetKey
		});

		html = renderTemplate(PASSWORD_RESET_TEMPLATE, {
			resetPasswordLink: `http://${DOMAIN}/auth/passwordReset/${resetKey}`
		});

	} else {
		html = renderTemplate(PASSWORD_RESET_HELP_TEMPLATE, {
			email: body.email
		});
	}

	await context.state.emailClient.sendMail(body.email, "Password Reset", html);

	context.status = 200;
});

router.post("/reset", {
	validate: {
		body: {
			password: PASSWORD_VALIDATOR,
			repeatPassword: PASSWORD_VALIDATOR,
			resetKey: Joi.string().uuid({
				version: "uuidv4"
			})
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body as IResetPassword;

	const passwordReset = await PasswordReset.findOne<PasswordReset>({
		where: {
			resetKey: body.resetKey
		}
	});

	if(!passwordReset) {
		throwApiError(context, new HttpError(400, ErrorMessage.BAD_RESET_KEY));
		return;
	}

	await PasswordReset.destroy({
		where: {
			id: passwordReset.id
		}
	});

	const oneDayAgo = subDays(new Date(), 1);
	const isOld = isBefore(passwordReset.createdAt, oneDayAgo);

	if(isOld) {
		throwApiError(context, new HttpError(400, ErrorMessage.EXPIRED_RESET_KEY));
		return;
	}

	const hashedPassword = await hashPassword(body.password);

	await User.update<User>({
			password: hashedPassword
		}, {
			where: {
				id: passwordReset.userId
			}
	});

	context.status = 200;
});

export default router;