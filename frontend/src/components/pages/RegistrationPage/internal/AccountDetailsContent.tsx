import * as React from "react";

import MailIcon from "@material-ui/icons/Mail";
import KeyIcon from "@material-ui/icons/VpnKey";
import PhoneIcon from "@material-ui/icons/Phone";

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
	PASSWORD_MAX_LENGTH,
	PHONE_NUMBER_MAX_LENGTH,
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
		const phoneNumberLabel = simpleFormat(this, "things.phoneNumber");

		return (
			<Box>
				<Box mb={margin}
					display="flex"
					justifyContent="center">


					<Typography variant="h6">
						<FormattedMessage id="things.accountDetails"/>
					</Typography>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						type="email"
						value={controller.model.email}
						minLength={EMAIL_MIN_LENGTH}
						maxLength={EMAIL_MAX_LENGTH}
						label={emailLabel}
						required={true}
						onChange={event => controller.onChange("email", event.target.value)}
						startAdornment={ <MailIcon /> }
						errorModel={controller.errorModel}
						validationKey="email"
						errorTranslationValues={{
							value: emailLabel,
							minLength: EMAIL_MIN_LENGTH,
							maxLength: EMAIL_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						type="tel"
						value={controller.model.phoneNumber}
						maxLength={PHONE_NUMBER_MAX_LENGTH}
						label={phoneNumberLabel}
						onChange={event => controller.onChange("phoneNumber", event.target.value)}
						startAdornment={ <PhoneIcon /> }
						errorModel={controller.errorModel}
						validationKey="phoneNumber"
						errorTranslationValues={{
							value: phoneNumberLabel,
							maxLength: PHONE_NUMBER_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						type="password"
						value={controller.model.password}
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
				</Box>

				<Box mb={margin}>
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
				</Box>
			</Box>
		)
	}
}

export default injectIntl(AccountDetailsContent);