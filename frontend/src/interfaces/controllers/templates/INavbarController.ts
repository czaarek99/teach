import { Routes } from "../../Routes";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	
	isSelected: (route: Routes) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Routes) => void
}
