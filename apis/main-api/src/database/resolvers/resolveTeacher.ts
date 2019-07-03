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

	let teacher : ITeacher = {
		firstName: user.firstName,
		lastName: user.lastName,
		city: user.address.city,
		age,
		//avatarFileName
		avatarFileName: "avatar.jpg"
	};

	for(const setting of user.settings) {
		if(setting.key === "showEmail") {
			teacher.email = user.email;
		} else if(setting.key === "showPhone") {
			teacher.phoneNumber = user.phoneNumber;
		}
	}

	return teacher;
}