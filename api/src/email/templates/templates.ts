import * as Handlebars from "handlebars"
import * as HandlebarsIntl from "handlebars-intl";

import { readFileSync } from "fs";
import { join } from "path";
import translations from "../translations";

HandlebarsIntl.registerWith(Handlebars);

export interface IPasswordResetTemplate {
	resetPasswordLink: string
}

export interface IPasswordResetHelpTemplate {
	email: string
}

function compileTemplate<T>(fileName: string) : HandlebarsTemplateDelegate<T> {
	const filePath = join(__dirname, "handlebars", `${fileName}.hbs`);
	const data = readFileSync(filePath, "utf8");
	return Handlebars.compile<T>(data);
}

export function renderTemplate<T>(template: Handlebars.TemplateDelegate<T>, options: T) : string {
	return template(options, {
		data: {
			intl: {
				locales: [
					"en-US"
				],
				messages: translations.en
			}
		}
	})
}

export const PASSWORD_RESET_TEMPLATE = compileTemplate<IPasswordResetTemplate>("passwordReset")
export const PASSWORD_RESET_HELP_TEMPLATE = compileTemplate<IPasswordResetHelpTemplate>("passwordResetHelp")
export const WELCOME_TEMPLATE = compileTemplate<{}>("welcome")

