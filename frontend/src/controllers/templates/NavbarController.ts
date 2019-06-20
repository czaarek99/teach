import { INavbarController } from "../../interfaces/controllers/templates/INavbarController";
import { observable } from "mobx";

export class NavbarController implements INavbarController {
	@observable public navigationDrawerIsOpen = false;

	public onToggleDrawer() : void {
		this.navigationDrawerIsOpen = !this.navigationDrawerIsOpen
	}
}