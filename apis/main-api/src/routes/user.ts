import * as Router from "koa-joi-router";

import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";
import { authenticationMiddleware, throwApiError } from "server-lib";
import { resolveUser } from "../database/resolvers/resolveUser";
import { IPersonalInput, IAddress, IPasswordInput, HttpError, ErrorMessage } from "common-library";
import { Joi } from "koa-joi-router";

import {
	FIRST_NAME_VALIDATOR,
	LAST_NAME_VALIDATOR,
	BIRTH_DATE_VALIDATOR,
	PHONE_NUMBER_VALIDATOR,
	ADDRESS_VALIDATOR,
	PASSWORD_VALIDATOR
} from "../validators";
import { hashPassword } from "../util/hashPassword";

const router = Router();

router.use(authenticationMiddleware);

router.get("/self", async (context: CustomContext) => {

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

	const currentHash = await hashPassword(input.currentPassword);

	const user : User = await User.findOne<User>({
		where: {
			id: context.state.session.userId,
			password: currentHash
		}
	});

	if(!user) {
		throwApiError(
			context,
			new HttpError(
				401,
				ErrorMessage.WRONG_CURRENT_PASSWORD,
				context.state.requestId
			)
		);
	}

});

export default router;
