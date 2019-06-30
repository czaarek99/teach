import { observable, action } from "mobx";
import { IUserService } from "../interfaces/services/IUserService";
import { isAfter } from "date-fns";

import {
	IUser,
	SESSION_KEY_NAME,
	USER_KEY_NAME,
	EXPIRATION_DATE_KEY_NAME,
	IPersonalInput
} from "common-library";

export interface IUserCache {
	readonly loading: boolean
	readonly isLoggedIn: boolean

	readonly user?: IUser

	recache: () => Promise<void>
	updatePersonalInfo: (input: IPersonalInput) => void
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

	public updatePersonalInfo(input: IPersonalInput) : void {
		if(this.user) {
			this.user.lastName = input.lastName;
			this.user.firstName = input.firstName;
			this.user.lastName = input.lastName;
			this.user.phoneNumber = input.phoneNumber;

			localStorage.setItem(USER_KEY_NAME, JSON.stringify(this.user));
		}
	}

	@action
	public async recache() : Promise<void> {
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

			try {
				this.user = await this.userService.getSelf();
				localStorage.setItem(USER_KEY_NAME, JSON.stringify(this.user));
			} catch(error) {
				localStorage.removeItem(USER_KEY_NAME);
				localStorage.removeItem(SESSION_KEY_NAME);
				localStorage.removeItem(EXPIRATION_DATE_KEY_NAME);

				this.isLoggedIn = false;
			}

		}

		this.loading = false;
	}
}