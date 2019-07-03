import React from 'react';

import PersonalInformationContent from "./internal/PersonalInformationContent";
import AddressContent from "./internal/AddressContent";
import AccountDetailsContent from "./internal/AccountDetailsContent";

import { observer } from "mobx-react";
import { WithStyles } from "@material-ui/styles";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";

import {
	IProfilePageController
} from "../../../interfaces/controllers/pages/IProfilePageController";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},
});

interface IProfilePageProps {
	controller: IProfilePageController
	navbarController: INavbarController
}

@observer
class ProfilePage extends React.Component<
	InjectedIntlProps &
	IProfilePageProps &
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
							<FormattedMessage id="things.pages.profile"/>
						</Typography>
					</Paper>

					<PersonalInformationContent controller={controller.personalController}/>
					<AddressContent controller={controller.addressController}/>
					<AccountDetailsContent controller={controller.accountDetailsController}/>
				</div>
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(ProfilePage))