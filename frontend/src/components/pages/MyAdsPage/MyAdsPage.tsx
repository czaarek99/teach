import React from 'react';
import AddIcon from '@material-ui/icons/Add';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { Ad } from "../../organisms";
import { IAdController } from "../../../interfaces/controllers/IAdController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
	Paper,
	Fab
} from "@material-ui/core";

import {
	IMyAdsPageController
} from "../../../interfaces/controllers/pages/IMyAdsPageController";

import {
	INavbarController
} from "../../../interfaces/controllers/templates/INavbarController";

const styles = (theme: Theme) => createStyles({

	container: {
		position: "relative"
	},

	titlePaper: {
		padding: 10
	},

	fab: {
		position: "fixed",
		margin: 10,
		bottom: 0,
		right: 0
	},

	myAdsContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		flexWrap: "wrap"
	}

});

interface IMyAdsPageProps {
	navbarController: INavbarController
	controller: IMyAdsPageController
}

@observer
class MyAdsPage extends React.Component<
	IMyAdsPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			navbarController,
			classes,
			controller
		} = this.props;

		const ads = controller.adControllers.map((controller: IAdController) => {
			return (
				<Ad controller={controller}
					key={controller.controllerId}/>
			);
		});

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.container}>
					<Paper className={classes.titlePaper}>
						<Typography variant="h4">
							<FormattedMessage id="things.pages.myads"/>
						</Typography>
					</Paper>

					<div className={classes.myAdsContainer}>
						{ads}
					</div>
				</div>

				<Fab className={classes.fab}
					disabled={!controller.canAdd}
					onClick={() => controller.onNewAd()}>

					<AddIcon />
				</Fab>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(MyAdsPage));