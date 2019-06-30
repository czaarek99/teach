import React from 'react';
import UserIcon from "@material-ui/icons/AccountBox";

import { observer } from "mobx-react";
import { WithStyles } from "@material-ui/styles";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { CustomTextField } from "../../molecules";
import { simpleFormat } from "../../../util/simpleFormat";
import { CustomDatePicker } from "../../organisms";

import {
	ISettingsPageController
} from "../../../interfaces/controllers/pages/ISettingsPageController";

import {
	FIRST_NAME_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	getUserMaxDate
} from "common-library";

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

	normalPaper: {
		marginTop: 10,
		padding: 10
	}
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

		const isDisabled = controller.loading;

		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const birthDateLabel = simpleFormat(this, "things.birthDate");


		return (
			<NavbarTemplate controller={navbarController}>
				<div>
					<Paper className={classes.titlePaper}>
						<Typography variant="h4">
							<FormattedMessage id="things.pages.settings"/>
						</Typography>
					</Paper>

					<Paper className={classes.normalPaper}>
						<Typography variant="h5">
							<FormattedMessage id="things.account" />
						</Typography>

						<CustomTextField disabled={isDisabled}
							value={controller.accountModel.firstName}
							minLength={FIRST_NAME_MIN_LENGTH}
							maxLength={FIRST_NAME_MAX_LENGTH}
							label={firstNameLabel}
							required={true}
							onChange={event => controller.onAccountChange("firstName", event.target.value)}
							startAdornment={ <UserIcon /> }
							errorModel={controller.accountErrorModel}
							validationKey="firstName"
							errorTranslationValues={{
								value: firstNameLabel,
								minLength: FIRST_NAME_MIN_LENGTH,
								maxLength: FIRST_NAME_MAX_LENGTH
							}}
						/>

						<CustomTextField disabled={isDisabled}
							value={controller.accountModel.lastName}
							minLength={LAST_NAME_MIN_LENGTH}
							maxLength={LAST_NAME_MAX_LENGTH}
							label={lastNameLabel}
							required={true}
							onChange={event => controller.onAccountChange("lastName", event.target.value)}
							startAdornment={ <UserIcon /> }
							errorModel={controller.accountErrorModel}
							validationKey="lastName"
							errorTranslationValues={{
								value: firstNameLabel,
								minLength: LAST_NAME_MIN_LENGTH,
								maxLength: LAST_NAME_MAX_LENGTH
							}}
						/>

						<CustomDatePicker value={controller.accountModel.birthDate}
							disabled={isDisabled}
							required={true}
							label={birthDateLabel}
							maxDate={getUserMaxDate()}
							onChange={date => controller.onAccountChange("birthDate", date)}
						/>

						<Button>
							<FormattedMessage id="actions.save"/>
						</Button>
					</Paper>
				</div>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(SettingsPage))