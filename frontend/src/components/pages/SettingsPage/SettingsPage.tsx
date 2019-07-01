import React from 'react';

import { observer } from "mobx-react";
import { WithStyles } from "@material-ui/styles";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";

import {
	ISettingsPageController
} from "../../../interfaces/controllers/pages/ISettingsPageController";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
} from "@material-ui/core";
import PersonalInformationSettings from "./internal/PersonalInformationSettings";
import AddressSettings from "./internal/AddressSettings";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},
});

interface ISettingsPageProps {
	controller: ISettingsPageController
	navbarController: INavbarController
}

@observer
class SettingsPage extends React.Component<
	InjectedIntlProps &
	ISettingsPageProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			controller,
			navbarController,
			classes
		} = this.props;




		return (
			<NavbarTemplate controller={navbarController}>
				<div>
					<Paper className={classes.titlePaper}>
						<Typography variant="h4">
							<FormattedMessage id="things.pages.settings"/>
						</Typography>
					</Paper>

					<PersonalInformationSettings controller={controller.personalController}/>
					<AddressSettings controller={controller.addressController}/>
				</div>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(SettingsPage))