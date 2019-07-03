import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { RouterStore } from "mobx-react-router";
import { observable, action } from "mobx";
import { Route } from "../../interfaces/Routes";
import { IUserCache } from "../../util/UserCache";
import { IAuthenticationService } from "../../interfaces/services/IAuthenticationService";
import { LoadingButtonState } from "../../components";

export class NavbarController implements INavbarController {

	private readonly routingStore: RouterStore;
	private readonly authService: IAuthenticationService;

	@observable public readonly userCache: IUserCache;
	@observable public navigationDrawerIsOpen = false;
	@observable public logoutButtonState : LoadingButtonState = "default";

	constructor(
		routingStore: RouterStore,
		userCache: IUserCache,
		authService: IAuthenticationService
	) {
		this.routingStore = routingStore;
		this.userCache = userCache;
		this.authService = authService;
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
		this.routingStore.push(route);
	}

	public isSelected(route: Route) : boolean {
		return this.routingStore.location.pathname === route;
	}

	@action
	public async logOut() : Promise<void> {
		this.logoutButtonState = "loading";
		await this.authService.logOut();

		this.userCache.logOut();

		this.routingStore.push(Route.BROWSE);
		this.logoutButtonState = "success";
	}

	@action
	public logIn() : void {
		this.routingStore.push(Route.LOGIN);
	}
}
