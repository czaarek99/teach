import React from 'react';
import MailIcon from "@material-ui/icons/Mail";
import KeyIcon from "@material-ui/icons/VpnKey";

import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { observer } from "mobx-react";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomTextField, LoadingButton } from "../../../molecules";
import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH } from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	Paper,
	Typography,
	withStyles,
	Button
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

	field: {
		marginBottom: 8
	},

	changePasswordButton: {
		marginRight: 10
	}
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
		const currentPasswordLabel = simpleFormat(this, "things.currentPassword");
		const passwordLabel = simpleFormat(this, "things.password");
		const newPasswordLabel = simpleFormat(this, "things.newPassword");
		const repeatPasswordLabel = simpleFormat(this, "actions.repeatPassword");

		const isDisabled = controller.loading;

		let changePasswordContent;

		if(controller.isChangingPassword) {
			changePasswordContent = (
				<React.Fragment>
					<CustomTextField disabled={isDisabled}
						className={classes.field}
						type="password"
						value={controller.model.currentPassword}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={currentPasswordLabel}
						required={true}
						onChange={event => controller.onChange("currentPassword", event.target.value)}
						startAdornment={ <KeyIcon /> }
					/>

					<CustomTextField disabled={isDisabled}
						className={classes.field}
						type="password"
						value={controller.model.newPassword}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={newPasswordLabel}
						required={true}
						onChange={event => controller.onChange("newPassword", event.target.value)}
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
						className={classes.field}
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

					<div>
						<LoadingButton onClick={() => controller.onSave()}
							className={classes.changePasswordButton}
							state={controller.saveButtonState}>

							<FormattedMessage id="actions.change" />
						</LoadingButton>

						<Button variant="contained"
							onClick={() => controller.cancelChangePassword()}>

							<FormattedMessage id="actions.cancel" />
						</Button>
					</div>
				</React.Fragment>
			)
		} else {
			changePasswordContent = (
				<Button variant="contained"
					onClick={() => controller.changePassword()}>

					<FormattedMessage id="actions.changePassword"/>
				</Button>
			)
		}

		return (
			<Paper className={classes.normalPaper}>
				<Typography variant="h5">
					<FormattedMessage id="things.accountDetails"/>
				</Typography>

				<div className={classes.fieldContainer}>
					<CustomTextField disabled={true}
						className={classes.field}
						type="email"
						value={controller.email}
						label={emailLabel}
						required={true}
						startAdornment={ <MailIcon /> }
					/>

					<Typography>
						{passwordLabel}
					</Typography>
					{changePasswordContent}
				</div>
			</Paper>
		)
	}

}

export default withStyles(styles)(injectIntl(AccountDetailsSettings));