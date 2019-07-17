import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { observable, action, computed } from "mobx";
import { Route } from "../../interfaces/Route";
import { LoadingButtonState } from "../../components";
import { RootStore } from "../../stores/RootStore";
import { IUser } from "common-library";

export class NavbarController implements INavbarController {

	@observable private readonly rootStore: RootStore;
	@observable public navigationDrawerIsOpen = false;
	@observable public logoutButtonState : LoadingButtonState = "default";

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	@computed
	public get isLoggedIn() : boolean {
		return this.rootStore.userCache.isLoggedIn;
	}

	@computed
	public get cachedUser() : IUser | undefined {
		return this.rootStore.userCache.user;
	}

	@action
	public onToggleDrawer() : void {
		this.navigationDrawerIsOpen = !this.navigationDrawerIsOpen;
	}

	@action
	public onWindowResize() : void {
		this.navigationDrawerIsOpen = false;
	}

	@action
	public onNavItemClick(route: Route) : void {
		this.rootStore.routingStore.push(route);
		this.navigationDrawerIsOpen = false;
	}

	public isSelected(route: Route) : boolean {
		return this.rootStore.routingStore.location.pathname === route;
	}

	@action
	public async logOut() : Promise<void> {
		this.logoutButtonState = "loading";
		await this.rootStore.services.authenticationService.logOut();

		this.rootStore.userCache.logOut();

		this.rootStore.routingStore.push(Route.BROWSE);
		this.logoutButtonState = "success";
	}

	@action
	public logIn() : void {
		this.rootStore.routingStore.push(Route.LOGIN);
	}

	@action
	public register() : void {
		this.rootStore.routingStore.push(Route.REGISTRATION);
	}
}
