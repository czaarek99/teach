import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";

import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { Address } from "../database/models/Address";
import { authenticationMiddleware, throwApiError } from "server-lib";
import { resolveUser } from "../database/resolvers/resolveUser";
import { Joi } from "koa-joi-router";
import { hashPassword } from "../util/hashPassword";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { Op, Sequelize } from "sequelize";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";

import {
	IPersonalInput,
	IAddress,
	IPasswordInput,
	HttpError,
	ErrorMessage,
	ISearchUsersInput,
	ITeacher,
	USER_SEARCH_MIN_LENGTH,
} from "common-library";

import {
	FIRST_NAME_VALIDATOR,
	LAST_NAME_VALIDATOR,
	BIRTH_DATE_VALIDATOR,
	PHONE_NUMBER_VALIDATOR,
	ADDRESS_VALIDATOR,
	PASSWORD_VALIDATOR
} from "../validators";

const router = Router();

router.use(authenticationMiddleware);

router.get("/self", async (context: CustomContext) => {

	const user : User = await User.findOne<User>({
		where: {
			id: context.state.session.userId
		},
		include: [
			Address,
			ProfilePicture
		]
	});

	if(!user) {
		throwApiError(
			context,
			new HttpError(
				404,
				ErrorMessage.USER_NOT_FOUND,
				context.state.requestId
			)
		);

		return;
	}

	context.body = resolveUser(user);
	context.status = 200;
});

router.patch("/personal", {
	validate: {
		body: {
			firstName: FIRST_NAME_VALIDATOR,
			lastName: LAST_NAME_VALIDATOR,
			birthDate: BIRTH_DATE_VALIDATOR,
			phoneNumber: PHONE_NUMBER_VALIDATOR
		},
		type: "json"
	},
}, async (context: CustomContext) => {

	const personal = context.request.body as IPersonalInput;

	await User.update<User>({
		firstName: personal.firstName,
		lastName: personal.lastName,
		birthDate: personal.birthDate
	}, {
		where: {
			id: context.state.session.userId
		}
	})

	context.status = 200;
});

router.patch("/address", {
	validate: {
		body: ADDRESS_VALIDATOR,
		type: "json"
	}
}, async (context: CustomContext) => {

	const address = context.request.body as IAddress;

	await Address.update<Address>({
		street: address.street,
		zipCode: address.zipCode,
		city: address.city,
		countryCode: address.countryCode,
		state: address.state
	}, {
		where: {
			userId: context.state.session.userId
		}
	});

	context.status = 200;
});

router.patch("/password", {
	validate: {
		body: {
			newPassword: PASSWORD_VALIDATOR,
			currentPassword: Joi.string().min(1)
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const input = context.request.body as IPasswordInput;

	const user : User = await User.findOne<User>({
		where: {
			id: context.state.session.userId
		}
	});

	const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

	if(!isPasswordValid) {
		throwApiError(
			context,
			new HttpError(
				401,
				ErrorMessage.WRONG_CURRENT_PASSWORD,
				context.state.requestId
			)
		);

		return;
	}

	if(input.newPassword === user.email) {
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

	const newPassword = await hashPassword(input.newPassword);

	await User.update<User>({
		password: newPassword
	}, {
		where: {
			id: context.state.session.userId,
		}
	});

	context.status = 200;
});

router.get("/search", {
	validate: {
		query: {
			search: Joi.string().min(USER_SEARCH_MIN_LENGTH).required()
		}
	}
}, async (context: CustomContext) => {

	const input = context.query  as ISearchUsersInput;
	const lowercaseSearch = input.search.toLowerCase();

	const users : User[] = User.findAll<User>({
		where: {
			[Op.or]: [
				{
					firstName: Sequelize.where(
						Sequelize.fn("lower", Sequelize.col("firstName")),
						{
							[Op.like]: lowercaseSearch
						}
					)
				},
				{
					lastName: Sequelize.where(
						Sequelize.fn("lower", Sequelize.col("lastName")),
						{
							[Op.like]: lowercaseSearch
						}
					)
				}
			]
		},
		limit: 30
	});

	const output : ITeacher[] = users.map(resolveTeacher);
	context.body = output;
	context.status = 200;
});

export default router;
