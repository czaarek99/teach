import Axios from "axios";
import { config } from "../config";

interface IRecaptchaResponse {
	success: boolean
	challenge_ts: string
	hostname: string
	"error-codes": string[]
}

const CAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptcha(captcha: string, userIP: string) : Promise<boolean> {

	console.log(config.recaptchaSecret)

	const params = new URLSearchParams();
	params.set("secret", config.recaptchaSecret);
	params.set("response", captcha);
	params.set("remoteip", userIP);

	const requestUrl = `${CAPTCHA_URL}?${params.toString()}`;
	const response = await Axios.post<IRecaptchaResponse>(requestUrl);

	return response.data.success;
}