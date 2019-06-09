import React from 'react';
import KeyIcon from "@material-ui/icons/VpnKey";

import { Theme, createStyles, WithStyles, withStyles, Typography } from '@material-ui/core';
import { InjectedIntlProps, injectIntl, FormattedMessage } from 'react-intl';
import { IResetPasswordPageController } from '../../../interfaces/controllers/pages/IResetPasswordPageController';
import { AuthenticationTemplate, AUTHENTICATION_MARGIN } from '../../templates';
import { simpleFormat } from "../../../util/simpleFormat";
import { CustomTextField, LoadingButton, InfoBox } from "../../molecules";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "common-library";
import { observer } from "mobx-react";

const styles = (theme: Theme) => createStyles({

	textField: {
		marginBottom: AUTHENTICATION_MARGIN
	},

	buttonContainer: {
		marginTop: AUTHENTICATION_MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	infoBox: {
		marginTop: AUTHENTICATION_MARGIN
	}

});

interface IResetPasswordPageProps {
	controller: IResetPasswordPageController
}

@observer
export class ResetPasswordPage extends React.Component<
	IResetPasswordPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {
		const {
			controller,
			classes
		} = this.props;

		const resetPasswordLabel = simpleFormat(this, "actions.resetPassword");
		const newPasswordLabel = simpleFormat(this,  "things.newPassword")
		const passwordLabel = simpleFormat(this, "things.password");
		const repeatPasswordLabel = simpleFormat(this, "actions.repeatPassword");

		const isDisabled = controller.disabled;

		let infoBox = null;

		if(controller.infoBoxMessage !== null) {
			infoBox = (
				<InfoBox type={controller.infoBoxType}
					className={classes.infoBox}>

					<Typography>
						<FormattedMessage id={controller.infoBoxMessage}/>
					</Typography>
				</InfoBox>
			);
		}

		return (
			<AuthenticationTemplate title={resetPasswordLabel}>

				<CustomTextField disabled={isDisabled}
					className={classes.textField}
					type="password"
					maxLength={PASSWORD_MAX_LENGTH}
					minLength={PASSWORD_MIN_LENGTH}
					value={controller.model.password}
					label={newPasswordLabel}
					required={true}
					onChange={event => controller.onChange("password", event.target.value)}
					startAdornment={ <KeyIcon /> }
					errorModel={controller.errorModel}
					validationKey="password"
					errorTranslationValues={{
						value: passwordLabel,
						minLength: PASSWORD_MIN_LENGTH
					}}
				/>

				<CustomTextField disabled={isDisabled}
					type="password"
					maxLength={PASSWORD_MAX_LENGTH}
					minLength={PASSWORD_MIN_LENGTH}
					value={controller.model.repeatPassword}
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

				{infoBox}

				<div className={classes.buttonContainer}>
					<LoadingButton state={controller.resetPasswordButtonState}
						onClick={() => controller.onSubmit()}>
							{resetPasswordLabel}
					</LoadingButton>
				</div>

			</AuthenticationTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(ResetPasswordPage));