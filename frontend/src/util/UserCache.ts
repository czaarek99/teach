import { observable } from "mobx";
import { IUser, SESSION_KEY_NAME, USER_KEY_NAME, EXPIRATION_DATE_KEY_NAME } from "common-library";
import { IUserService } from "../interfaces/services/IUserService";
import { isAfter } from "date-fns";

export interface IUserCache {
	readonly loading: boolean
	readonly isLoggedIn: boolean

	readonly user?: IUser

	recache: () => Promise<void>
}

export class UserCache implements IUserCache {

	private readonly userService: IUserService;

	@observable public isLoggedIn = false;
	@observable public loading = true;
	@observable public user?: IUser;

	constructor(userService: IUserService) {
		this.userService = userService;

		this.recache();
	}

	public async recache() {
		this.loading = true;

		const session = localStorage.getItem(SESSION_KEY_NAME);
		const expirationDate = localStorage.getItem(EXPIRATION_DATE_KEY_NAME);

		if(expirationDate && session) {
			const expirationTimestamp = parseInt(expirationDate);
			const date = new Date(expirationTimestamp);
			const now = new Date();

			this.isLoggedIn = isAfter(date, now);
		}

		if(this.isLoggedIn) {
			const cachedUser = localStorage.getItem(USER_KEY_NAME);

			if(cachedUser) {
				this.user = JSON.parse(cachedUser);
			}

			this.user = await this.userService.getSelf();
			localStorage.setItem(USER_KEY_NAME, JSON.stringify(this.user));
		}

		this.loading = false;
	}

}