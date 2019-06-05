import { ErrorMessage } from "common-library";

export type ValidationResult = ErrorMessage | null;
export type Validator = (value: any) => ValidationResult

export type ValidatorMap<T> = {
	[K in keyof T]: Validator[]
}

export function validate(value: any, validators: Validator[]) : string[] {
	const errorIds = [];

	for(const validator of validators) {
		const validationResult = validator(value);
		if(validationResult !== null) {
			errorIds.push(validationResult);
		}
	}

	return errorIds;
}