import { ErrorMessage } from "common-library";

export default {
	[ErrorMessage.UNAUTHORIZED]: "You're unauthorized to access this resource",
	[ErrorMessage.EMPTY]: "{value} can't be empty",
	[ErrorMessage.EMAIL_EXISTS]: "This email is already registered to an account",
	[ErrorMessage.USER_NOT_FOUND]: "No user found with this email & password",
	[ErrorMessage.UNKNOWN]: "Unknown error",
	[ErrorMessage.INTERNAL_SERVER_ERROR]: "Internal server error. Contact the administrator",
}