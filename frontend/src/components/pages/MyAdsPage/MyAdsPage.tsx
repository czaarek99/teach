import React from 'react';
import AddIcon from '@material-ui/icons/Add';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { IMyAdsPageController } from "../../../interfaces/controllers/pages/IMyAdsPageController";

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
		position: "absolute",
		margin: 10,
		bottom: 0,
		right: 0
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

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.container}>
					<Paper className={classes.titlePaper}>
						<Typography variant="h4">
							<FormattedMessage id="things.pages.myads"/>
						</Typography>
					</Paper>

					<Fab className={classes.fab}
						onClick={() => controller.onNewAd()}>

						<AddIcon />
					</Fab>
				</div>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(MyAdsPage));