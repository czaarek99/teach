import { observable } from "mobx";
import { SESSION_COOKIE_NAME } from "common-library";
import { IUserService } from "../interfaces/services/IUserService";

export interface IUserCache {
	readonly loading: boolean
	readonly hasCached: boolean
	readonly isLoggedIn: boolean

	readonly firstName?: string | null
	readonly lastName?: string | null
	readonly email?: string | null
}

export class UserCache implements IUserCache {

	private readonly userService: IUserService;

	@observable public isLoggedIn: boolean;
	@observable public hasCached: boolean;

	@observable public loading = true;
	@observable public firstName?: string | null = null;
	@observable public lastName?: string | null = null;
	@observable public email?: string | null = null;

	constructor(userService: IUserService) {
		this.userService = userService;

		const session = localStorage.getItem(SESSION_COOKIE_NAME);
		this.isLoggedIn =  session !== null;

		this.hasCached = localStorage.getItem("user.cache") === "true";

		this.load();
	}

	private async load() {
		if(this.isLoggedIn) {
			if(this.hasCached) {
				this.firstName = localStorage.getItem("user.firstName");
				this.lastName = localStorage.getItem("user.lastName");
				this.email = localStorage.getItem("user.email");
			}

			const user = await this.userService.getSelf();

			this.firstName = user.firstName;
			this.lastName = user.lastName;
			this.email = user.email;

			localStorage.setItem("user.firstName", user.firstName);
			localStorage.setItem("user.lastName", user.lastName);
			localStorage.setItem("user.cache", "true");

			this.hasCached = true;

			if(user.email) {
				localStorage.setItem("user.email", user.email);
			}
		}

		this.loading = false;
	}

}