import { ErrorMessage } from "common-library";
import { ValidationResult } from "./validate";

export function empty(value: string) : ValidationResult {
	const trimmed = value.replace(/\s/g, "");

	if(trimmed.length === 0) {
		return ErrorMessage.EMPTY;
	}

	return null;
}