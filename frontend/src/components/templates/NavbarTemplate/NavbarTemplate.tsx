import React from 'react';
import Skeleton from "react-loading-skeleton";
import HomeIcon from "@material-ui/icons/Home"
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";
import BrowseIcon from "@material-ui/icons/Search";

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { observer } from 'mobx-react';
import { simpleFormat } from '../../../util/simpleFormat';
import { Route } from '../../../interfaces/Routes';
import { PRODUCT_NAME } from 'common-library';

import {
	INavbarController
} from '../../../interfaces/controllers/templates/INavbarController';

import {
	ListItem,
	ListItemIcon,
	ListItemText,
	List,
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Hidden,
	Drawer,
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Divider,
	Avatar
} from '@material-ui/core';

const drawerWidth = 270;

const styles = (theme: Theme) => createStyles({
	root: {
		display: "flex",
		minHeight: "100vh"
	},

	drawer: {
		[theme.breakpoints.up("sm")]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},

	appBar: {
		marginLeft: drawerWidth,

		[theme.breakpoints.up("sm")]: {
			width: `calc(100% - ${drawerWidth}px)`,
		},
	},

	menuButton: {
		[theme.breakpoints.up("sm")]: {
			display: "none",
		},
	},

	toolbar: {
		display: "flex",
		alignItems: "center",
		marginLeft: 16,
		marginRight: 16,

		...theme.mixins.toolbar
	},

	drawerPaper: {
		width: drawerWidth,
	},

	main: {
		flexGrow: 1,
		padding: 10,
	},

	avatar: {
		marginRight: 16
	},

	contactDetails: {
		flexGrow: 1,
		flexShrink: 0,
		paddingRight: 5
	},

	content: {
		minHeight: `calc(100% - 48px)`,

		[theme.breakpoints.up("sm")]: {
			minHeight: `calc(100% - 64px)`,
		},

		display: "flex",
		flexDirection: "column",

		"& > *": {
			flex: 1
		}
	},

});

interface INavbarTemplateProps {
	controller: INavbarController
}

type ExternalProps =
	INavbarTemplateProps &
	InjectedIntlProps &
	WithStyles<typeof styles>;

@observer
class NavbarTemplate extends React.Component<ExternalProps> {

	private renderNavigationItem(
		text: string,
		icon: React.ReactElement,
		route: Route
	) : React.ReactNode {

		const translation = simpleFormat(this, text);

		const {
			controller
		} = this.props;

		return (
			<ListItem button={true}
				selected={controller.isSelected(route)}
				onClick={() => controller.onNavItemClick(route)}
				key={text}>

				<ListItemIcon>
					{icon}
				</ListItemIcon>

				<ListItemText primary={translation}/>
			</ListItem>
		)
	}

	private onResize = () : void => {
		this.props.controller.onWindowResize();
	}

	public componentDidMount() : void {
		window.addEventListener("resize", this.onResize);
	}

	public componentWillUnmount() : void {
		window.removeEventListener("resize", this.onResize);
	}

	private renderDrawerContent() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		let avatarComponent : React.ReactNode;
		let realNameComponent : React.ReactNode;
		let emailComponent : React.ReactNode;

		const cache = controller.userCache;
		if(cache.isLoggedIn) {
			const cachedUser = cache.user;

			if(cachedUser) {

				avatarComponent = (
					<Avatar>
						{cachedUser.firstName && cachedUser.firstName[0]}
					</Avatar>
				);

				realNameComponent = cachedUser.firstName;
				emailComponent = cachedUser.email;
			} else {
				avatarComponent = (
					<Skeleton width={40}
						height={40}
						circle={true}/>
				);

				realNameComponent = <Skeleton />;
				emailComponent = <Skeleton />;
			}
		}

		return (
			<div>
				<div className={classes.toolbar}>
					<div className={classes.avatar}>
						{avatarComponent}
					</div>

					<div className={classes.contactDetails}>
						<Typography noWrap={true}>
							{realNameComponent}
						</Typography>

						<Typography variant="body2"
							noWrap={true}
							color="textSecondary">

							{emailComponent}
						</Typography>
					</div>
				</div>

				<Divider />

				<List>
					{this.renderNavigationItem("things.pages.home", <HomeIcon />, Route.HOME)}
					{this.renderNavigationItem("things.pages.browse", <BrowseIcon />, Route.BROWSE)}
					{this.renderNavigationItem("things.pages.profile", <PersonIcon />, Route.PROFILE)}
					{this.renderNavigationItem("things.pages.settings", <SettingsIcon />, Route.SETTINGS)}
				</List>
			</div>
		)
	}

	public render() : React.ReactNode {

		const {
			controller,
			classes,
			children
		} = this.props;

		return (
			<div className={classes.root}>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<IconButton edge="start" onClick={() => controller.onToggleDrawer()}>
							<MenuIcon className={classes.menuButton}/>
						</IconButton>
						<Typography variant="h6">
							{PRODUCT_NAME}
						</Typography>
					</Toolbar>
				</AppBar>
				<nav className={classes.drawer}>
					<Hidden smUp={true} implementation="css">
						<Drawer variant="temporary"
							anchor="left"
							onClose={() => controller.onToggleDrawer()}
							classes={{
								paper: classes.drawerPaper,
							}}
							ModalProps={{
								keepMounted: true
							}}
							open={controller.navigationDrawerIsOpen}>

							{this.renderDrawerContent()}
						</Drawer>
					</Hidden>
					<Hidden xsDown={true}>
						<Drawer variant="permanent"
							classes={{
								paper: classes.drawerPaper,
							}}
							open={true}>
							{this.renderDrawerContent()}
						</Drawer>
					</Hidden>
				</nav>
				<main className={classes.main}>
					<div className={classes.toolbar}/>
					<div className={classes.content}>
						{children}
					</div>
				</main>
			</div>
		)
	}

}
export default withStyles(styles)(injectIntl(NavbarTemplate));
