import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";

import { Joi } from "koa-joi-router";
import { User } from "../database/models/User";
import { CustomContext } from "../Server";
import { Address } from "../database/models/Address";
import { PasswordReset } from "../database/models/PasswordReset";
import { v4 } from "uuid";
import { isBefore, subDays } from "date-fns";
import { randomBytes } from "crypto";
import { IRedisSession, getNewExpirationDate, throwApiError } from "server-lib";
import { verifyRecaptcha } from "../util/verifyRecaptcha";
import { Image } from "../database/models/Image";
import { resolveUser } from "../database/resolvers/resolveUser";

import {
	HttpError,
	ErrorMessage,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
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
	DOMAIN,
	IRegistrationInput,
	ILoginInput,
	IForgotInput,
	IResetPasswordInput,
	IAuthOutput,
} from "common-library";

import {
	PASSWORD_RESET_TEMPLATE,
	renderTemplate,
	PASSWORD_RESET_HELP_TEMPLATE
} from "../email/templates/templates";

import {
	FIRST_NAME_VALIDATOR,
	LAST_NAME_VALIDATOR,
	BIRTH_DATE_VALIDATOR,
	PHONE_NUMBER_VALIDATOR,
	SIMPLE_EMAIL_VALIDATOR,
	PASSWORD_VALIDATOR,
	ADDRESS_VALIDATOR
} from "../validators";

async function hashPassword(password: string) : Promise<string> {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
}

async function logIn(context: CustomContext, user: User) : Promise<void> {
	const sessionId = await randomBytes(128).toString("hex");

	const newExpiration = getNewExpirationDate();

	await context.state.redisClient.setJSONObject<IRedisSession>(sessionId, {
		userId: user.id,
		expirationDate: newExpiration
	});

	const response : IAuthOutput = {
		sessionId,
		expirationDate: newExpiration,
		user: resolveUser(user),
	}

	context.body = response;
	context.status = 200;
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

function throwNoSuchUserError(context: CustomContext) {
	throwApiError(context, new HttpError(
			404,
			ErrorMessage.USER_NOT_FOUND,
			context.state.requestId
		)
	);
}

const router = Router();

router.post("/register", {
	validate: {
		body: {
			user: Joi.object({
				email: SIMPLE_EMAIL_VALIDATOR,
				firstName: FIRST_NAME_VALIDATOR,
				lastName: LAST_NAME_VALIDATOR,
				birthDate: BIRTH_DATE_VALIDATOR,
				phoneNumber: PHONE_NUMBER_VALIDATOR,
				address: ADDRESS_VALIDATOR
			}).required(),

			captcha: Joi.string(),
			password: PASSWORD_VALIDATOR,
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body as IRegistrationInput;

	const captchaResult = await verifyRecaptcha(context, body.captcha);
	if(!captchaResult) {
		return;
	}

	if(!validateEmail(context, body.user.email)) {
		return;
	}

	if(body.password === body.user.email) {
		throwApiError(
			context,
			new HttpError(
				400,
				ErrorMessage.PASSWORD_AND_EMAIL_SAME,
				context.state.requestId
			)
		);

		return;
	}

	const oldUser = await User.findOne({
		where: {
			email: body.user.email
		}
	});

	if(oldUser) {
		throwApiError(
			context,
			new HttpError(
				409,
				ErrorMessage.EMAIL_EXISTS,
				context.state.requestId
			)
		);

		return;
	}

	const hashedPassword = await hashPassword(body.password);

	const user = body.user;

	const newUser : User = await User.create<User>({
		email: user.email,
		password: hashedPassword,
		firstName: user.firstName,
		lastName: user.lastName,
		birthDate: user.birthDate,
		phoneNumber: user.phoneNumber,
		address: user.address
	}, {
		include: [
			Address
		]
	});

	context.state.logger.info("User registration",  {
		userId: newUser.id
	});

	await logIn(context, newUser);
});

router.post("/login", {
	validate: {
		body: {
			email: Joi.string().max(EMAIL_MAX_LENGTH).required(),
			password: Joi.string().max(PASSWORD_MAX_LENGTH).required()
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body as ILoginInput;

	const user : User = await User.findOne<User>({
		where: {
			email: body.email
		},
		include: [
			Address,
			Image
		]
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


	await logIn(context, user);
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

	const body = context.request.body as IForgotInput;

	if(!validateEmail(context, body.email)) {
		return;
	}

	const captchaResult = await verifyRecaptcha(context, body.captcha);
	if(!captchaResult) {
		return;
	}

	const user : User = await User.findOne<User>({
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
			resetKey: Joi.string().uuid({
				version: "uuidv4"
			})
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const body = context.request.body as IResetPasswordInput;

	const passwordReset = await PasswordReset.findOne<PasswordReset>({
		where: {
			resetKey: body.resetKey
		}
	});

	if(!passwordReset) {
		throwApiError(
			context,
			new HttpError(
				400,
				ErrorMessage.BAD_RESET_KEY,
				context.state.requestId
			)
		);

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
		throwApiError(
			context,
			new HttpError(
				400,
				ErrorMessage.EXPIRED_RESET_KEY,
				context.state.requestId
			)
		);

		return;
	}

	const hashedPassword = await hashPassword(body.password);

	await User.update<User>(
		{
			password: hashedPassword
		},
		{
			where: {
				id: passwordReset.userId
			}
		}
	);

	context.status = 200;
});

export default router;