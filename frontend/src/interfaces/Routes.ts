export enum Route {
	LOGIN = "/auth/login",
	REGISTRATION = "/auth/register",
	FORGOT_PASSWORD = "/auth/forgot",
	RESET_PASSWORD = "/auth/reset",
	SETTINGS = "/settings",
	BROWSE = "/browse",
	PROFILE = "/profile",
	AD = "/ad",
	HOME = "/"
}

export const DEFAULT_ROUTE = Route.HOME;