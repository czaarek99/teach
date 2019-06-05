import { createLogger, Logger as Winston, transports } from "winston";

interface ILogData {
	loggerName: string
	message: string
	date: Date
	[key: string]: any
}

export class Logger {

	private readonly data : object = {};
	private readonly winston: Winston;
	private readonly loggerName: string;

	constructor(loggerName: string, data?: object) {
		this.loggerName = loggerName;

		if(data) {
			for(const [key, value] of Object.entries(data)) {
				if(value !== undefined) {
					this.data[key] = value;
				}
			}
		}

		this.winston = createLogger({
			transports: [
				new transports.Console()
			]
		});
	}

	private getData(message: string) : ILogData {
		const data : ILogData = {
			...this.data,
			message,
			loggerName: this.loggerName,
			date: new Date(),
		};

		return data;
	}

	public error(error: string) : void {
		this.winston.error(this.getData(error));
	}

	public info(message: string) : void {
		this.winston.info(this.getData(message));
	}

	public debug(message: string) : void {
		this.winston.debug(this.getData(message));
	}

}