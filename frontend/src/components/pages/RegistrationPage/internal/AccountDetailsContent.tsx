import React from 'react';

import { observer } from "mobx-react";
import { IRegistrationContentProps } from "../RegistrationPage";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

import {
	EMAIL_MIN_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
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

		const keyIcon = (
			<FontAwesomeIcon icon={faKey}/>
		);

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
						startAdornment={ <FontAwesomeIcon icon={faEnvelope}/> }
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
						type="password"
						value={controller.model.password}
						minLength={PASSWORD_MIN_LENGTH}
						maxLength={PASSWORD_MAX_LENGTH}
						label={passwordLabel}
						required={true}
						onChange={event => controller.onChange("password", event.target.value)}
						startAdornment={keyIcon}
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
						startAdornment={keyIcon}
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