import { User } from "../models/User";
import { ITeacher } from "common-library";
import { differenceInYears } from "date-fns";

export function resolveTeacher(user: User) : ITeacher {

	const now = new Date();
	const age = differenceInYears(now, user.birthDate);

	let avatarFileName = null;
	if(user.profilePicture) {
		avatarFileName = user.profilePicture.imageFileName;
	}

	return {
		firstName: user.firstName,
		lastName: user.lastName,
		phoneNumber: user.phoneNumber,
		email: user.email,
		city: user.address.city,
		age,
		//avatarFileName
		avatarFileName: "avatar.jpg"
	}
}