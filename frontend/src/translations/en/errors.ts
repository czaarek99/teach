import { ErrorMessage } from "common-library";

export default {
	[ErrorMessage.UNAUTHORIZED]: "You're unauthorized to access this resource",
	[ErrorMessage.EMPTY]: "{value} can't be empty",
	[ErrorMessage.EMAIL_EXISTS]: "This email is already registered to an account",
	[ErrorMessage.USER_NOT_FOUND]: "No user found with this email & password",
	[ErrorMessage.UNKNOWN]: "Unknown error",
	[ErrorMessage.INTERNAL_SERVER_ERROR]: "Internal server error. Contact the administrator",
	[ErrorMessage.USER_TOO_YOUNG]: "You have to be at least 18 to register",
	[ErrorMessage.COMPONENT]: "Unknown javascript error",
	[ErrorMessage.TOO_SHORT]: "{value} is too short. It has to be at least {minLength} characters long.",
	[ErrorMessage.TOO_LONG]: "{value} is too long. It can not be longer than {maxLength} characters long.",
	[ErrorMessage.INVALID_EMAIL]: "Invalid email",
	[ErrorMessage.PASSWORDS_DONT_MATCH]: "Passwords do not match",
	[ErrorMessage.BAD_CAPTCHA]: "Invalid captcha",
	[ErrorMessage.NOT_SET]: "{value} has to be set",
	[ErrorMessage.PASSWORD_AND_EMAIL_SAME]: "Password and email can not be the same!",
	[ErrorMessage.BAD_RESET_KEY]: "The reset key you provided is invalid.",
	[ErrorMessage.BAD_UUID]: "{value} is not a valid uuid",
	[ErrorMessage.EXPIRED_RESET_KEY]: "This password reset link has expired.",
	[ErrorMessage.AD_NOT_FOUND]: "Can not find an ad with that id"
}