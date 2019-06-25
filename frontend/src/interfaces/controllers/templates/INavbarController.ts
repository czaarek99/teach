import { Route } from "../../Routes";
import { IUserCache } from "../../../util/UserCache";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	readonly userCache: IUserCache

	isSelected: (route: Route) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Route) => void
}
