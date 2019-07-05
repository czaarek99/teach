export enum Route {
	//Auth
	LOGIN = "/auth/login",
	REGISTRATION = "/auth/register",
	FORGOT_PASSWORD = "/auth/forgot",
	RESET_PASSWORD = "/auth/reset",

	//Restricted pages
	SETTINGS = "/settings",
	PROFILE = "/profile",
	DMS = "/dms",
	MY_ADS = "/myads",
	NEW_AD = "/newad",

	//Public pages
	BROWSE = "/browse",
	AD = "/ad",
	HOME = "/"
}

export const DEFAULT_ROUTE = Route.HOME;