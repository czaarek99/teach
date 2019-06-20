export interface INavbarController {
	readonly navigationDrawerIsOpen: boolean
	
	onToggleDrawer: () => void
}