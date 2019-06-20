export enum Routes {
	LOGIN = "/auth/login",
	REGISTRATION = "/auth/register",
	FORGOT_PASSWORD = "/auth/forgot",
	RESET_PASSWORD = "/auth/reset",

	PROFILE = "/profile",
	SETTINGS = "/settings",

	BROWSE = "/browse",
	HOME = "/"
}

export const DEFAULT_ROUTE = Routes.HOME;