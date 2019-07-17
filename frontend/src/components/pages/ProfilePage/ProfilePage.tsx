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

	public render() : React.ReactNode {

		const {
			controller,
			navbarController,
			classes
		} = this.props;

		let errorSnackbar = null;
		if(controller.errorMessage) {
			errorSnackbar = (
				<Snackbar open={true}
					key={controller.errorMessage}
					ContentProps={{
						"className": classes.errorSnackbarContent
					}}
					action={
						<Button onClick={() => controller.onSnackbarClose()}>
							<FormattedMessage id="actions.ok"/>
						</Button>
					}
					message={
						<FormattedMessage id={controller.errorMessage}/>
					}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					onClose={() => controller.onSnackbarClose()}/>
			);
		}

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

				{errorSnackbar}
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(ProfilePage))