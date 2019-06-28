import { User } from "../models/User";
import { IUser } from "common-library";

export function resolveUser(user: User) : IUser {
	const address = user.address;

	const resolved : IUser = {
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
		resolved.avatarFileName = user.profilePicture.imageFileName;
	}

	return resolved;
}