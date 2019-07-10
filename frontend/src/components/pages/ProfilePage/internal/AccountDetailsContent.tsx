import React from 'react';

import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { observer } from "mobx-react";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomTextField, LoadingButton, InfoBox } from "../../../molecules";
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
	IAccountDetailsProfileController
} from "../../../../interfaces/controllers/profile/IAccountDetailsProfileController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faEnvelope } from "@fortawesome/free-solid-svg-icons";

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
	},

		errorBox: {
			marginBottom: 10
		}
});

interface IAccountDetailsContentProps {
	controller: IAccountDetailsProfileController
}

@observer
class AccountDetailsContent extends React.Component<
	InjectedIntlProps &
	WithStyles<typeof styles> &
	IAccountDetailsContentProps
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

		const keyIcon = (
			<FontAwesomeIcon icon={faKey}/>
		);

		if(controller.isChangingPassword) {
			let errorMessage;

			if(controller.errorMessage) {
				errorMessage = (
					<InfoBox type="error"
						className={classes.errorBox}>

						<FormattedMessage id={controller.errorMessage}/>
					</InfoBox>
				)
			}

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
						startAdornment={keyIcon}
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
						startAdornment={keyIcon}
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
						startAdornment={keyIcon}
						errorModel={controller.errorModel}
						validationKey="repeatPassword"
						errorTranslationValues={{
							value: passwordLabel
						}}
					/>

					{errorMessage}

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
						startAdornment={ <FontAwesomeIcon icon={faEnvelope}/> }
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

export default withStyles(styles)(injectIntl(AccountDetailsContent));