import React from 'react';
import PrivacyContent from "./internal/PrivacyContent";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { WithStyles } from "@material-ui/styles";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { NavbarTemplate } from "../../templates";
import { LoadingButton } from "../../molecules";

import {
	ISettingsPageController
} from "../../../interfaces/controllers/pages/ISettingsPageController";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},
});

interface ISettingsPageProps {
	navbarController: INavbarController
	controller: ISettingsPageController
}

@observer
class SettingsPage extends React.Component<
	ISettingsPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			navbarController,
			classes,
			controller
		} = this.props;

		let resetButton = null;
		if(controller.showReset) {
			resetButton = (
				<Button variant="contained"
					onClick={() => controller.onReset()}>

					<FormattedMessage id="actions.reset"/>
				</Button>
			)
		}

		return (
			<NavbarTemplate controller={navbarController}>
				<Paper className={classes.titlePaper}>
					<Typography variant="h4">
						<FormattedMessage id="things.pages.settings"/>
					</Typography>

					<PrivacyContent controller={controller}/>

					<div>
						<LoadingButton onClick={() => controller.onSave()}
							state={controller.saveButtonState}>

							<FormattedMessage id="actions.save"/>
						</LoadingButton>
						{resetButton}
					</div>
				</Paper>
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(SettingsPage));