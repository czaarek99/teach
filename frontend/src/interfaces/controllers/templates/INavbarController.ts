import { LoadingButtonState } from "../../../components";
import { IUser } from "common-library";
import { Route } from "../../Route";

export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	readonly logoutButtonState: LoadingButtonState
	readonly isLoggedIn: boolean
	readonly cachedUser?: IUser

	isSelected: (route: Route) => boolean
	onWindowResize: () => void
	onToggleDrawer: () => void
	onNavItemClick: (route: Route) => void
	logOut: () => Promise<void>
	logIn: () => void
	register: () => void
}
