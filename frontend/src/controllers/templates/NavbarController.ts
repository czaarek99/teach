import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { RouterStore } from "mobx-react-router";
import { observable } from "mobx";
import { Route } from "../../interfaces/Routes";
import { IUserCache } from "../../util/UserCache";

export class NavbarController implements INavbarController {

	private readonly routingStore: RouterStore;
	@observable public readonly userCache: IUserCache;
	@observable public navigationDrawerIsOpen = false;

	constructor(routingStore: RouterStore, userCache: IUserCache) {
		this.routingStore = routingStore;
		this.userCache = userCache;
	}

	public onToggleDrawer() : void {
		this.navigationDrawerIsOpen = !this.navigationDrawerIsOpen;
	}

	public onWindowResize() : void {
		this.navigationDrawerIsOpen = false;
	}

	public onNavItemClick(route: Route) : void {
		this.routingStore.push(route);
	}

	public isSelected(route: Route) : boolean {
		return this.routingStore.location.pathname === route;
	}
}
