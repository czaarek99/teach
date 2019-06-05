import { createLogger, Logger as Winston, transports } from "winston";

export class Logger {

	private readonly winston: Winston;

	constructor() {
		this.winston = createLogger({
			transports: [
				new transports.Console()
			]
		})
	}

	public userError(userId: number, error: string) : void {
		this.winston.error({
			userId,
			error
		});
	}

	public userInfo(userId: number, message: string) : void {
		this.winston.info({
			userId,
			message
		});
	}

	public userDebug(userId: number, message: string) : void {
		this.winston.debug({
			userId,
			message
		})
	}

	public error(error: string) : void {
		this.winston.error(error);
	}

	public info(message: string) : void {
		this.winston.info(message);
	}

	public debug(message: string) : void {
		this.winston.debug(message);
	}

}