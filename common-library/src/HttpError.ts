export interface IHttpError {
	readonly error: string
	readonly requestId: string
	readonly statusCode: number
	readonly uncaught: boolean
}

export class HttpError implements IHttpError {

	private _statusCode: number;
	private _error: string;
	private _requestId: string;
	private _uncaught: boolean;

	constructor(statusCode?: number, error?: string, requestId?: string, uncaught?: boolean) {
		this._statusCode = statusCode;
		this._error = error;
		this._requestId = requestId;

		this._uncaught = uncaught === true;
	}

	public get error() : string {
		return this._error;
	}

	public get statusCode() : number {
		return this._statusCode;
	}

	public get requestId() : string {
		return this._requestId;
	}

	public get uncaught() : boolean {
		return this._uncaught;
	}

	public toJSON() : IHttpError {
		return {
			error: this.error,
			requestId: this.requestId,
			statusCode: this.statusCode,
			uncaught: this.uncaught
		}
	}

	public fromJSON(object: IHttpError) : void {
		this._statusCode = object.statusCode;
		this._error = object.error;
		this._requestId = object.requestId;
		this._uncaught = object.uncaught;
	}
}