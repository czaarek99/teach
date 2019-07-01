import { Route } from "../../Routes";
import { IUserCache } from "../../../util/UserCache";
import { LoadingButtonState } from "../../../components";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	readonly userCache: IUserCache
	readonly logoutButtonState: LoadingButtonState

	isSelected: (route: Route) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Route) => void
	logOut: () => Promise<void>
	logIn: () => void
}
