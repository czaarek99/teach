import React from 'react';
import ProfilePictureContent from "./internal/ProfilePictureContent";
import PersonalInformationContent from "./internal/PersonalInformationContent";
import AddressContent from "./internal/AddressContent";
import AccountDetailsContent from "./internal/AccountDetailsContent";

import { observer } from "mobx-react";
import { WithStyles } from "@material-ui/styles";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController, IProfilePageController } from "../../../interfaces";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
	Snackbar,
	Button,
} from "@material-ui/core";
import { ErrorSnackbar } from "../../organisms";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
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

	private renderSnackbar() : React.ReactNode {

		const {
			controller
		} = this.props;

		return (
			<ErrorSnackbar errorMessage={controller.errorMessage}
				onClose={() => controller.onSnackbarClose()}
				action={
					<Button onClick={() => controller.onSnackbarClose()}>
						<FormattedMessage id="actions.ok"/>
					</Button>
				}
			/>
		)
	}

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
					<ProfilePictureContent controller={controller.profilePictureController}/>
				</div>

				{this.renderSnackbar()}
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(ProfilePage))