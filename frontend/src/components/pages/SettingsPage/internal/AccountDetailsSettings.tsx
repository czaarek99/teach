import React from 'react';
import MailIcon from "@material-ui/icons/Mail";
import KeyIcon from "@material-ui/icons/VpnKey";

import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { observer } from "mobx-react";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomTextField } from "../../../molecules";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	Paper,
	Typography,
	withStyles
} from "@material-ui/core";

import {
	IAccountDetailsSettingsController
} from "../../../../interfaces/controllers/settings/IAccountDetailsSettingsController";

const styles = (theme: Theme) => createStyles({
	normalPaper: {
		marginTop: 10,
		padding: 10
	},

	fieldContainer: {
		maxWidth: 300
	},
});

interface IAccountDetailsSettingsProps {
	controller: IAccountDetailsSettingsController
}

@observer
class AccountDetailsSettings extends React.Component<
	InjectedIntlProps &
	WithStyles<typeof styles> &
	IAccountDetailsSettingsProps
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const repeatPasswordLabel = simpleFormat(this, "actions.repeatPassword");

		const isDisabled = controller.loading;

		return (
			<Paper className={classes.normalPaper}>
				<Typography variant="h5">
					<FormattedMessage id="things.accountDetails"/>
				</Typography>

				<div className={classes.fieldContainer}>
					<CustomTextField disabled={true}
						type="email"
						value={controller.email}
						label={emailLabel}
						required={true}
						startAdornment={ <MailIcon /> }
					/>

					<CustomTextField disabled={isDisabled}
						type="password"
						value={controller.model.newPassword}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={passwordLabel}
						required={true}
						onChange={event => controller.onChange("password", event.target.value)}
						startAdornment={ <KeyIcon /> }
						errorModel={controller.errorModel}
						validationKey="password"
						errorTranslationValues={{
							value: passwordLabel,
							minLength: PASSWORD_MIN_LENGTH,
							maxLength: PASSWORD_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						type="password"
						value={controller.model.repeatPassword}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={repeatPasswordLabel}
						required={true}
						onChange={event => controller.onChange("repeatPassword", event.target.value)}
						startAdornment={ <KeyIcon /> }
						errorModel={controller.errorModel}
						validationKey="repeatPassword"
						errorTranslationValues={{
							value: passwordLabel
						}}
					/>
				</div>
			</Paper>
		)
	}

}

export default withStyles(styles)(injectIntl(AccountDetailsSettings));