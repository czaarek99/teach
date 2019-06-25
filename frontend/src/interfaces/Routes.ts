export enum Route {
	LOGIN = "/auth/login",
	REGISTRATION = "/auth/register",
	FORGOT_PASSWORD = "/auth/forgot",
	RESET_PASSWORD = "/auth/reset",

	PROFILE = "/profile",
	SETTINGS = "/settings",

	BROWSE = "/browse",
	AD = "/ad",
	HOME = "/"
}

export const DEFAULT_ROUTE = Route.HOME;