import React from 'react';
import Skeleton from "react-loading-skeleton";
import MenuIcon from "@material-ui/icons/Menu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { observer } from 'mobx-react';
import { simpleFormat } from '../../../util/simpleFormat';
import { Route } from '../../../interfaces/Routes';
import { PRODUCT_NAME } from 'common-library';
import { LoadingButton, CustomAvatar } from "../../molecules";
import { getImageUrl } from "../../../util/imageAPI";

import {
	INavbarController
} from '../../../interfaces/controllers/templates/INavbarController';

import {
	faCog,
	faUser,
	faAd,
	faHome,
	faSearch,
	faComments
} from "@fortawesome/free-solid-svg-icons";

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
	Avatar,
	Button
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
		overflow: "hidden",

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

	accountText: {
		minWidth: 0
	},

	logoutButtonContainer: {
		display: "flex",
		justifyContent: "center"
	},

	registerButton: {
		marginRight: 10
	},

	navIcon: {
		fontSize: 20
	}

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

	private onResize = () : void => {
		this.props.controller.onWindowResize();
	}

	public componentDidMount() : void {
		window.addEventListener("resize", this.onResize);
	}

	public componentWillUnmount() : void {
		window.removeEventListener("resize", this.onResize);
	}

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

	private renderDrawerContent() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		let avatarComponent : React.ReactNode;
		let realNameComponent : React.ReactNode;
		let emailComponent : React.ReactNode;

		if(controller.isLoggedIn) {
			const cachedUser = controller.cachedUser;

			if(cachedUser) {

				avatarComponent = (
					<CustomAvatar imageUrl={cachedUser.avatarFileName}
						alt={cachedUser.firstName[0]}/>
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

		let loggedInPages;
		let loginLogoutButton;

		if(controller.isLoggedIn) {
			loggedInPages = (
				<React.Fragment>
					{this.renderNavigationItem(
						"things.pages.settings",
						<FontAwesomeIcon icon={faCog}
							className={classes.navIcon}/>,
						Route.SETTINGS
					)}

					{this.renderNavigationItem(
						"things.pages.profile",
						<FontAwesomeIcon icon={faUser}
							className={classes.navIcon}/>,
						Route.PROFILE
					)}
					{this.renderNavigationItem(
						"things.pages.myads",
						<FontAwesomeIcon icon={faAd}
							className={classes.navIcon}/>,
						Route.MY_ADS
					)}
					{this.renderNavigationItem(
						"things.pages.dms",
						<FontAwesomeIcon icon={faComments}
							className={classes.navIcon} />,
						Route.DMS
					)}
				</React.Fragment>
			);

			loginLogoutButton = (
				<div className={classes.logoutButtonContainer}>
					<LoadingButton state={controller.logoutButtonState}
						onClick={() => controller.logOut()}>

						<FormattedMessage id="actions.logOut" />
					</LoadingButton>
				</div>
			);
		} else {
			loginLogoutButton = (
				<div className={classes.logoutButtonContainer}>
					<Button variant="contained"
						className={classes.registerButton}
						onClick={() => controller.register()}>

						<FormattedMessage id="actions.register"/>
					</Button>

					<Button variant="contained"
						onClick={() => controller.logIn()}>

						<FormattedMessage id="actions.logIn" />
					</Button>
				</div>
			);
		}

		return (
			<div>
				<div className={classes.toolbar}>
					<div className={classes.avatar}>
						{avatarComponent}
					</div>

					<div className={classes.contactDetails}>
						<Typography noWrap={true}
							className={classes.accountText}>
							{realNameComponent}
						</Typography>

						<Typography variant="body2"
							noWrap={true}
							className={classes.accountText}
							color="textSecondary">

							{emailComponent}
						</Typography>
					</div>
				</div>

				<Divider />

				<List>
					{this.renderNavigationItem(
						"things.pages.home",
						<FontAwesomeIcon icon={faHome}
							className={classes.navIcon}/>,
						Route.HOME
					)}
					{this.renderNavigationItem(
						"things.pages.browse",
						<FontAwesomeIcon icon={faSearch}
							className={classes.navIcon}/>,
						Route.BROWSE
					)}
					{loggedInPages}
				</List>

				{loginLogoutButton}
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
