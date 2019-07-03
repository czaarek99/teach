import React from 'react';

import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { NavbarTemplate } from "../../templates";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";

import {
	createStyles,
	Theme,
	WithStyles,
	withStyles,
	Paper,
	Typography
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	paper: {
		padding: 10
	}
});

interface IHomePageProps {
	navbarController: INavbarController
}

export class HomePage extends React.Component<
	IHomePageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			navbarController,
			classes
		} = this.props;

		return (
			<NavbarTemplate controller={navbarController}>
				<Paper className={classes.paper}>
					<Typography>
						<FormattedMessage id="info.welcome"/>
					</Typography>
				</Paper>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(HomePage));