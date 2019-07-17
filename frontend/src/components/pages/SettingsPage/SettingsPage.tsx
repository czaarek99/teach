import React from 'react';
import PrivacyContent from "./internal/PrivacyContent";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { SaveButtons } from "../../organisms";
import { NavbarTemplate } from "../../templates";
import { ISettingsPageController, INavbarController } from "../../../interfaces";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
	WithStyles
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},

	resetButton: {
		marginLeft: 10
	}
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

		return (
			<NavbarTemplate controller={navbarController}>
				<Paper className={classes.titlePaper}>
					<Typography variant="h4">
						<FormattedMessage id="things.pages.settings"/>
					</Typography>

					<PrivacyContent controller={controller}/>

					<SaveButtons saveButtonState={controller.saveButtonState}
						onReset={() => controller.onReset()}
						onSave={() => controller.onSave()}
						showReset={controller.showReset}/>
				</Paper>
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(SettingsPage));