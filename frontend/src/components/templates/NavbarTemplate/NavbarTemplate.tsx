import React from 'react';

import HomeIcon from "@material-ui/icons/Home"
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import PersonIcon from "@material-ui/icons/Person";
import BrowseIcon from "@material-ui/icons/Search";

import { InjectedIntlProps, injectIntl } from 'react-intl';
import { inject } from 'mobx-react';
import { simpleFormat } from '../../../util/simpleFormat';
import { Routes } from '../../../interfaces/Routes';
import { PRODUCT_NAME } from 'common-library';

import { 
	INavbarController 
} from '../../../interfaces/controllers/templates/INavbarController';

import { 
	IRoutingStoreProps 
} from '../../../interfaces/props/IRoutingStoreProps';

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
	withStyles
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({

	root: {
		width: "100%"
	},

	split: {
		display: "flex"
	},

})


interface INavbarTemplateProps {
	controller: INavbarController
}

type ExternalProps = 
	INavbarTemplateProps & 
	InjectedIntlProps & 
	WithStyles<typeof styles>;

type AllProps = ExternalProps & IRoutingStoreProps;

@inject("routingStore")
class NavbarTemplate extends React.Component<ExternalProps> {

	private renderNavigationItem(
		text: string, 
		icon: React.ReactElement, 
		route: Routes
	) : React.ReactNode {

		const translation = simpleFormat(this, text);

		const {
			routingStore
		} = this.props as AllProps;

		return (
			<ListItem button={true} 
				onClick={() => {
					routingStore.push(route);
				}} 
				key={text}>

				<ListItemIcon>
					{icon}
				</ListItemIcon>

				<ListItemText primary={translation}/>
			</ListItem>
		)
	}

	private renderDrawerContent() : React.ReactNode {

		return (
			<div>
				<div style={this.props.theme.mixins.toolbar}/>
				<List>
					{this.renderNavigationItem("things.pages.home", <HomeIcon />, Routes.HOME)}
					{this.renderNavigationItem("things.pages.browse", <BrowseIcon />, Routes.BROWSE)}
					{this.renderNavigationItem("things.pages.profile", <PersonIcon />, Routes.PROFILE)}
					{this.renderNavigationItem("things.pages.settings", <SettingsIcon />, Routes.SETTINGS)}
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
				<AppBar position="sticky">
					<Toolbar>
						<IconButton edge="start">
							<MenuIcon onClick={() => controller.onToggleDrawer()}/>
						</IconButton>
						<Typography variant="h6">
							{PRODUCT_NAME}
						</Typography>
					</Toolbar>
				</AppBar>
				<div className={classes.split}>
					<nav>
						<Hidden smUp={true} implementation="css">
							<Drawer variant="temporary" anchor="left" 
								ModalProps={{
									keepMounted: true
								}}
								open={controller.navigationDrawerIsOpen}>

								{this.renderDrawerContent()}
							</Drawer>
						</Hidden>
						<Hidden xsDown={true}>
							<Drawer variant="permanent" open={true}>
								{this.renderDrawerContent()}
							</Drawer>
						</Hidden>
					</nav>
					<main>
						{children}
					</main>
				</div>
			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(NavbarTemplate));