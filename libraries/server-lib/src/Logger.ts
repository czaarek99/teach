import * as stringify from "json-stringify-safe";

interface ILogData {
	loggerName: string
	date: Date

	message?: string
	data?: object

	[key: string]: any
}

export enum LogLevel {
	CRITICAL = "critical",
	ERROR = "error",
	WARNING = "warning",
	INFO = "info",
	DEBUG = "debug"
}

export class Logger {

	private readonly persistentData : object = {};
	private readonly loggerName: string;

	constructor(loggerName: string, persistentData?: object) {
		this.loggerName = loggerName;

		if(persistentData) {
			for(const [key, value] of Object.entries(persistentData)) {
				if(value !== undefined) {
					this.persistentData[key] = value;
				}
			}
		}
	}

	private log(level: LogLevel, message: string, dataIn?: object) : void {
		const dataOut : ILogData = {
			...this.persistentData,
			level,
			loggerName: this.loggerName,
			date: new Date(),
		}

		if(dataIn) {
			dataOut.data = dataIn;
		}

		if(message) {
			dataOut.message = message;
		}

		console.log(stringify(dataOut));
	}

	public critical(message: string, dataIn?: object) : void {
		this.log(LogLevel.CRITICAL, message, dataIn);
	}

	public error(message: string, dataIn?: object) : void {
		this.log(LogLevel.ERROR, message, dataIn);
	}

	public warning(message: string, dataIn?: object) : void {
		this.log(LogLevel.WARNING, message, dataIn);
	}

	public info(message: string, dataIn?: object) : void {
		this.log(LogLevel.INFO, message, dataIn);
	}

	public debug(message: string, dataIn?: object) : void {
		this.log(LogLevel.DEBUG, message, dataIn);
	}
}