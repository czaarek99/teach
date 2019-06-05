export class HttpError {

	public readonly statusCode;
	public readonly error;

	constructor(statusCode: number, error: string) {
		this.statusCode = statusCode;
		this.error = error;
	}

	public toJSON() : object {
		return {
			error: this.error
		}
	}

}