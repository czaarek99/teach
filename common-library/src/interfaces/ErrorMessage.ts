export enum ErrorMessage {
	EMPTY = "error.empty",

	TOO_SHORT = "error.tooShort",
	TOO_LONG = "error.tooLong",
	WRONG_LENGTH = "error.wrongLength",

	DATE_TOO_BIG = "error.dateTooBig",
	DATE_TOO_SMALL = "error.dateTooSmall",

	INVALID_EMAIL = "error.invalidEmail",
	EMAIL_EXISTS = "error.emailExists",

	USER_NOT_FOUND = "error.userNotFound",
	UNAUTHORIZED = "error.unauthorized",
	UNKNOWN = "error.unknown",
	INTERNAL_SERVER_ERROR = "error.internalServerError"
}