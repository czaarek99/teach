import { action, observable } from "mobx";
import { createViewModel } from "mobx-utils";
import { ViewModel } from "../interfaces/ViewModel";

export interface ErrorState {
	[key: string]: string[]
}

interface ValidationObject<T extends ErrorState> {
	errorState: T
}

export class ErrorModel<T extends ErrorState> {

	@observable private validationObject: ViewModel<ValidationObject<T>>;

	constructor(errorState: T) {
		this.validationObject = createViewModel<ValidationObject<T>>(
			observable({
				errorState
			})
		);
	}

	public hasErrors() : boolean {
		for(const errors of Object.values(this.getAllErrors())) {
			if(errors.length !== 0) {
				return true;
			}
		}

		return false;
	}

	public getKeyErrors(key: keyof T) : string[] {
		return this.validationObject.errorState[key];
	}

	public getFirstKeyError(key: keyof T) : string | null {
		const errors = this.getKeyErrors(key);
		if(errors.length > 0) {
			return errors[0];
		} else {
			return null;
		}
	}

	public getAllErrors() : T {
		return this.validationObject.errorState;
	}

	@action public setErrors(key: keyof T, errors: string[]) : void {
		(this.validationObject.errorState as any)[key] = errors;
	}

	@action public reset() : void {
		this.validationObject.reset();
	}

	@action public submit() : void {
		this.validationObject.submit();
	}

}