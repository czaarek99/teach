import { Routes } from "../../Routes";
import { IUserCache } from "../../../util/UserCache";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	readonly userCache: IUserCache

	isSelected: (route: Routes) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Routes) => void
}
