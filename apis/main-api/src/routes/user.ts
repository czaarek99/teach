import * as Router from "koa-joi-router";
import { CustomContext } from "../Server";
import { User } from "../database/models/User";
import { Address } from "../database/models/Address";
import { Image } from "../database/models/Image";
import { authenticationMiddleware } from "server-lib";
import { IUser } from "common-library";

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

	const address = user.address;

	const response : IUser = {
		id: user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		birthDate: user.birthDate,
		email: user.email,
		phoneNumber: user.phoneNumber,
		address: {
			street: address.street,
			zipCode: address.zipCode,
			city: address.city,
			countryCode: address.countryCode,
			state: address.state
		},
	}

	if(user.profilePicture) {
		response.avatarFileName = user.profilePicture.imageFileName;
	}

	context.body = response;
	context.status = 200;
});

export default router;
