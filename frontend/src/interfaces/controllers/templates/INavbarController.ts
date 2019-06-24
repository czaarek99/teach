import { Routes } from "../../Routes";
import { ITeacher } from "common-library";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	readonly user: ITeacher | null
	readonly isLoggedIn: boolean

	isSelected: (route: Routes) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Routes) => void
}
