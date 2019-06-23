import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { RouterStore } from "mobx-react-router";
import { observable } from "mobx";
import { Routes } from "../../interfaces/Routes";

export class NavbarController implements INavbarController {

	private readonly routingStore: RouterStore;

	@observable public navigationDrawerIsOpen = false;

	constructor(routingStore: RouterStore) {
		this.routingStore = routingStore;
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
