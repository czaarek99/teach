import { observable } from "mobx";
import { SESSION_COOKIE_NAME, IUser } from "common-library";
import { IUserService } from "../interfaces/services/IUserService";

export interface IUserCache {
	readonly loading: boolean
	readonly isLoggedIn: boolean

	readonly user?: IUser
}

export class UserCache implements IUserCache {

	private readonly userService: IUserService;

	@observable public isLoggedIn: boolean;
	@observable public loading = true;
	@observable public user?: IUser;

	constructor(userService: IUserService) {
		this.userService = userService;

		const session = localStorage.getItem(SESSION_COOKIE_NAME);
		this.isLoggedIn =  session !== null;

		this.load();
	}

	private async load() {
		if(this.isLoggedIn) {
			const cachedUser = localStorage.getItem("user");

			if(cachedUser) {
				this.user = JSON.parse(cachedUser);
			}

			this.user = await this.userService.getSelf();
			localStorage.setItem("user", JSON.stringify(this.user));
		}

		this.loading = false;
	}

}