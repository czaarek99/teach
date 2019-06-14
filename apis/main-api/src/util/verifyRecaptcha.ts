import Axios from "axios";
import { config } from "../config";
import { CustomContext } from "../Server";
import { throwApiError } from "server-lib";
import { HttpError, ErrorMessage } from "common-library";

interface IRecaptchaResponse {
	success: boolean
	challenge_ts: string
	hostname: string
	"error-codes": string[]
}

const CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptcha(
	context: CustomContext, 
	captcha: string
) : Promise<boolean> {

	const params = new URLSearchParams();
	params.set("secret", config.recaptchaSecret);
	params.set("response", captcha);
	params.set("remoteip", context.ip);

	const requestUrl = `${CAPTCHA_URL}?${params.toString()}`;
	const response = await Axios.post<IRecaptchaResponse>(requestUrl);

	if(!response.data.success) {
		throwApiError(context, new HttpError(400, ErrorMessage.BAD_CAPTCHA));
	}

	return response.data.success;
}