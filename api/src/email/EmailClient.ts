import { createClient, Client, SendEmailError } from "node-ses"
import { config } from "../config";
import { DOMAIN } from "common-library";
import { Logger } from "server-lib";

export class EmailClient {

	private readonly sesClient: Client | null;
	private readonly logger: Logger;

	constructor(logger: Logger) {
		this.logger = logger;

		if(config.isProduction) {
			this.sesClient = createClient({
				key: config.sesKey,
				secret: config.sesSecret
			});
		}
	}

	public sendMail(to: string, subject: string, email: string) : Promise<void> {
		return new Promise((resolve, reject) => {
			const from = `noreply@${DOMAIN}`;

			const options = {
				from,
				to,
				subject,
				message: email
			};

			if(this.sesClient === undefined) {
				this.logger.warning("Printing mail to console in dev mode", options)

				resolve();
			} else {
				this.sesClient.sendEmail(options, (error: SendEmailError) => {
					if(error) {
						reject(error);
					} else {
						resolve();
					}
				})
			}
		})
	}

}