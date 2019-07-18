import { observable, action } from "mobx";
import { isAfter } from "date-fns";
import { IUserService } from "../interfaces";

import {
	IUser,
	SESSION_KEY_NAME,
	USER_KEY_NAME,
	EXPIRATION_DATE_KEY_NAME,
	IPersonalInput,
	IAddress
} from "common-library";

export interface IUserCache {
	readonly loading: boolean
	readonly isLoggedIn: boolean

	readonly user?: IUser

	recache: () => Promise<void>
	updatePersonalInfo: (input: IPersonalInput) => void
	updateAddress: (address: IAddress) => void
	updateProfilePic: (fileName: string) => void
	deleteProfilePic: () => void
	logOut: () => void
}

//TODO: This should actually be a store
export class UserCache implements IUserCache {

	private readonly userService: IUserService;

	@observable public isLoggedIn = false;
	@observable public loading = true;
	@observable public user?: IUser;

	constructor(userService: IUserService) {
		this.userService = userService;

		this.recache();
	}

	@action
	public updateProfilePic(fileName: string) {
		if(this.user) {
			this.user.avatarFileName = fileName;

			this.saveUserToLocalStorage();
		}
	}

	@action
	public deleteProfilePic() : void {
		if(this.user) {
			delete this.user.avatarFileName;

			this.saveUserToLocalStorage();
		}
	}

	@action
	public updatePersonalInfo(input: IPersonalInput) : void {
		if(this.user) {
			this.user.lastName = input.lastName;
			this.user.firstName = input.firstName;
			this.user.lastName = input.lastName;
			this.user.phoneNumber = input.phoneNumber;

			this.saveUserToLocalStorage();
		}
	}

	@action
	public updateAddress(address: IAddress) : void {
		if(this.user) {
			this.user.address = address;
			this.saveUserToLocalStorage();
		}
	}

	@action
	public logOut() : void {
		localStorage.removeItem(SESSION_KEY_NAME);
		localStorage.removeItem(EXPIRATION_DATE_KEY_NAME);
		localStorage.removeItem(USER_KEY_NAME);

		this.user = undefined;
		this.isLoggedIn = false;
	}

	private saveUserToLocalStorage() : void {
		localStorage.setItem(USER_KEY_NAME, JSON.stringify(this.user));
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
				this.saveUserToLocalStorage();
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