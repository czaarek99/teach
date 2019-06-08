import * as sendmail from "sendmail";

import { createClient, Client, SendEmailError } from "node-ses"
import { config } from "../config";
import { Logger } from "../util/Logger";
import { DOMAIN } from "common-library";

const sendMail = sendmail({});

export class EmailClient {

	private readonly sesClient: Client | null;

	constructor(logger: Logger) {
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
			};

			if(this.sesClient === null) {
				sendMail({
					...options,
					html: email
				}, (error: Error) => {
					if(error) {
						reject(error);
					} else {
						resolve();
					}
				})
			} else {
				this.sesClient.sendEmail({
					...options,
					message: email
				}, (error: SendEmailError) => {
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