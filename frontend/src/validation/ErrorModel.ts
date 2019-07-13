import { action, observable } from "mobx";
import { createViewModel } from "mobx-utils";
import { ViewModel } from "../interfaces/ViewModel";

export interface ErrorState {
	[key: string]: string[]
}

interface ValidationObject<T extends ErrorState> {
	errorState: T
}
/*

This ErrorModel kind of works. It really needs to be
refactored in the future if we have any kind of success.

Issues:
1. Reset function does not actually work
2. We are abusing createViewModel here
3. There probably is no need for a separate error model
interface for these. We should just use the interface
for the model
4. This does not handle more complex validation
5. We need to cast shit like idiots here
6. We should probably be showing the users errors
on submit instead of onChange for a better UX
experience. This errormodel should make that possible
within itself.
7. We copy paste the same validate function into all
controllers. Maybe this should be more closely tied
with our validators?


Overall it's a hard design issue which probably does
not matter in the beginning when we just want
to get a first working version out to check
for feasibility.

*/

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

	@action
	public setErrors(key: keyof T, errors: string[]) : void {
		(this.validationObject.errorState as any)[key] = errors;
	}

	@action
	public reset() : void {
		this.validationObject.reset();
	}

	@action
	public submit() : void {
		this.validationObject.submit();
	}

	@action
	public clear() : void {
		for(const key of Object.keys(this.validationObject.errorState)) {
			(this.validationObject.errorState[key] as any) = [];
		}
	}

}