import { ErrorMessage, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH } from "common-library";
import { ValidationResult, Validator } from "./validate";

export function empty(value: string) : ValidationResult {
	const trimmed = value.replace(/\s/g, "");

	if(trimmed.length === 0) {
		return ErrorMessage.EMPTY;
	}

	return null;
}

export function email(email: string) : ValidationResult {

	if(email.length < EMAIL_MIN_LENGTH) {
		return ErrorMessage.TOO_SHORT
	} else if(email.length > EMAIL_MAX_LENGTH) {
		return ErrorMessage.TOO_LONG;
	} else if(!email.includes("@")) {
		return ErrorMessage.INVALID_EMAIL
	}

	return null;
}

export function password(password: string) : ValidationResult {

	if(password.length > PASSWORD_MAX_LENGTH) {
		return ErrorMessage.TOO_LONG;
	} else if(password.length < PASSWORD_MIN_LENGTH) {
		return ErrorMessage.TOO_SHORT;
	}

	return null;
}

export function minLength(minLength: number) : Validator {

	return (value: string) : ValidationResult => {
		if(value.length < minLength) {
			return ErrorMessage.TOO_SHORT;
		}

		return null;
	}

}

export function maxLength(maxLength: number) : Validator {

	return (value: string) : ValidationResult => {
		if(value.length > maxLength) {
			return ErrorMessage.TOO_LONG
		}

		return null;
	}

}

export function exactLength(length: number) : Validator {

	return (value: string) : ValidationResult => {
		if(value.length !== length) {
			return ErrorMessage.WRONG_LENGTH;
		}

		return null;
	}

}

export function maxDate(maxDate: Date) : Validator {

	return (value: Date) : ValidationResult => {
		if(value > maxDate) {
			return ErrorMessage.DATE_TOO_BIG;
		}

		return null;
	}

}

export function minDate(minDate: Date) : Validator {

	return (value: Date) : ValidationResult => {
		if(value < minDate) {
			return ErrorMessage.DATE_TOO_SMALL;
		}

		return null;
	}

}