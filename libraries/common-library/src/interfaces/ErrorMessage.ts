export enum ErrorMessage {
	BAD_CAPTCHA = "error.badCaptcha",
	UNAUTHORIZED = "error.unauthorized",
	NOT_SET = "error.notSet",
	BAD_UUID = "error.badUUID",

	AD_NOT_FOUND = "error.adNotFound",
	NOT_ENOUGH_AD_IMAGES = "error.notEnoughAdImages",
	AD_CATEGORY_REQUIRED = "error.adCategoryRequired",

	EMPTY = "error.empty",
	TOO_SHORT = "error.tooShort",
	TOO_LONG = "error.tooLong",
	WRONG_LENGTH = "error.wrongLength",

	DATE_TOO_BIG = "error.dateTooBig",
	DATE_TOO_SMALL = "error.dateTooSmall",

	TEACHER_NOT_FOUND = "error.teacherNotFound",
	USER_NOT_FOUND = "error.userNotFound",
	USER_TOO_YOUNG = "error.userTooYoung",

	INVALID_EMAIL = "error.invalidEmail",
	EMAIL_EXISTS = "error.emailExists",

	COMPONENT = "error.component",
	UNKNOWN = "error.unknown",
	INTERNAL_SERVER_ERROR = "error.internalServerError",

	BAD_RESET_KEY = "error.badResetKey",
	EXPIRED_RESET_KEY = "error.expiredResetKey",

	PASSWORDS_DONT_MATCH = "error.passwordsDontMatch",
	PASSWORD_AND_EMAIL_SAME = "error.passwordAndEmailSame",
	WRONG_CURRENT_PASSWORD = "error.wrongCurrentPassword",

	INVALID_IMAGE = "error.invalidImage",
	IMAGE_UPLOAD_LIMIT_REACHED = "error.imageUploadLimit",

	CONVERSATION_NOT_FOUND = "error.convoNotFound",

}