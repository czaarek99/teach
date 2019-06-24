import Cookies from "js-cookie"

import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { RouterStore } from "mobx-react-router";
import { observable } from "mobx";
import { Routes } from "../../interfaces/Routes";
import { ITeacher, SESSION_COOKIE_NAME } from "common-library";
import { IUserService } from "../../interfaces/services/IUserService";

export class NavbarController implements INavbarController {

	private readonly routingStore: RouterStore;
	private readonly userService: IUserService;

	@observable public navigationDrawerIsOpen = false;
	@observable public user: ITeacher | null = null;
	@observable public isLoggedIn = false;

	constructor(userService: IUserService, routingStore: RouterStore) {
		this.userService = userService;
		this.routingStore = routingStore;

		const session = localStorage.getItem(SESSION_COOKIE_NAME);

		this.isLoggedIn =  session !== undefined;
		this.load();
	}

	private async load() : Promise<void> {
		if(this.isLoggedIn) {
			const user = await this.userService.getSelf();
			this.user = user;
		}
	}

	public onToggleDrawer() : void {
		this.navigationDrawerIsOpen = !this.navigationDrawerIsOpen;
	}

	public onWindowResize() : void {
		this.navigationDrawerIsOpen = false;
	}

	public onNavItemClick(route: Routes) : void {
		this.routingStore.push(route);
	}

	public isSelected(route: Routes) : boolean {
		return this.routingStore.location.pathname === route;
	}
}
