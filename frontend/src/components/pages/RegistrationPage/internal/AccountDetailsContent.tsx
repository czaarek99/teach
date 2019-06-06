import * as React from "react";

import MailIcon from "@material-ui/icons/Mail";
import KeyIcon from "@material-ui/icons/VpnKey";

import { observer } from "mobx-react";
import { IRegistrationContentProps } from "../RegistrationPage";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util/simpleFormat";

import {
	EMAIL_MIN_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH
} from "common-library";

@observer
class AccountDetailsContent extends React.Component<
	IRegistrationContentProps &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			margin,
			controller,
			isDisabled,
		} = this.props;

		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const repeatPasswordLabel = simpleFormat(this, "actions.repeatPassword");

		return (
			<Box>
				<Box marginBottom={margin}
					display="flex"
					justifyContent="center">


					<Typography variant="h6">
						<FormattedMessage id="things.accountDetails"/>
					</Typography>
				</Box>

				<Box marginBottom={margin}>
					<CustomTextField disabled={isDisabled}
						type="email"
						value={controller.registrationModel.email}
						minLength={EMAIL_MIN_LENGTH}
						maxLength={EMAIL_MAX_LENGTH}
						label={emailLabel}
						required={true}
						onChange={event => controller.onChange("email", event.target.value)}
						startAdornment={ <MailIcon /> }
						errorModel={controller.registrationErrorModel}
						validationKey="email"
						errorTranslationValues={{
							value: emailLabel
						}}
					/>
				</Box>

				<Box marginBottom={margin}>
					<CustomTextField disabled={isDisabled}
						type="email"
						value={controller.registrationModel.password}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={passwordLabel}
						required={true}
						onChange={event => controller.onChange("password", event.target.value)}
						startAdornment={ <KeyIcon /> }
						errorModel={controller.registrationErrorModel}
						validationKey="password"
						errorTranslationValues={{
							value: passwordLabel
						}}
					/>
				</Box>

				<Box marginBottom={margin}>
					<CustomTextField disabled={isDisabled}
						type="email"
						value={controller.registrationModel.repeatPassword}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={repeatPasswordLabel}
						required={true}
						onChange={event => controller.onChange("repeatPassword", event.target.value)}
						startAdornment={ <KeyIcon /> }
						errorModel={controller.registrationErrorModel}
						validationKey="repeatPassword"
						errorTranslationValues={{
							value: passwordLabel
						}}
					/>
				</Box>
			</Box>
		)
	}
}

export default injectIntl(AccountDetailsContent);