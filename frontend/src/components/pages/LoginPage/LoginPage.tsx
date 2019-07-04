import React from 'react';
import MailIcon from "@material-ui/icons/Mail";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import KeyIcon from "@material-ui/icons/VpnKey";

import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { observer } from "mobx-react";
import { PASSWORD_MAX_LENGTH, EMAIL_MAX_LENGTH } from "common-library";
import { InfoBox, CustomTextField, LoadingButton } from "../../molecules";
import { Route } from "../../../interfaces/Routes";
import { AuthenticationTemplate, AUTHENTICATION_MARGIN } from "../../templates";

import {
	ILoginPageController,
} from "../../../interfaces/controllers/pages/ILoginPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
	Link,
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	textField: {
		marginBottom: AUTHENTICATION_MARGIN
	},

	loginButtonContainer: {
		marginTop: AUTHENTICATION_MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	errorBox: {
		marginTop: AUTHENTICATION_MARGIN
	},

	loginButton: {
		width: 120,
		transition: "font-size 600ms",

		"&:hover": {
			fontSize: 0
		}
	},

});

interface ILoginPageProps {
	controller: ILoginPageController
}

@observer
class LoginPage extends React.Component<
	ILoginPageProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const loginLabel = simpleFormat(this, "actions.logIn");

		const disabled = controller.loading;

		let errorBox = null;

		if(controller.errorMessage !== null) {
			errorBox = (
				<InfoBox type="error"
					className={classes.errorBox}>

					<Typography>
						<FormattedMessage id={controller.errorMessage}/>
					</Typography>
				</InfoBox>
			);
		}

		return (
			<AuthenticationTemplate title={loginLabel}>
				<CustomTextField disabled={disabled}
					className={classes.textField}
					type="email"
					maxLength={EMAIL_MAX_LENGTH}
					value={controller.model.email}
					label={emailLabel}
					required={true}
					onChange={event => controller.onChange("email", event.target.value)}
					startAdornment={ <MailIcon /> }
					errorModel={controller.errorModel}
					validationKey="email"
					errorTranslationValues={{
						value: emailLabel
					}}
				/>

				<CustomTextField disabled={disabled}
					type="password"
					maxLength={PASSWORD_MAX_LENGTH}
					value={controller.model.password}
					label={passwordLabel}
					required={true}
					onChange={event => controller.onChange("password", event.target.value)}
					startAdornment={ <KeyIcon /> }
					errorModel={controller.errorModel}
					validationKey="password"
					errorTranslationValues={{
						value: passwordLabel
					}}
				/>

				<Link onClick={() => controller.goToRoute(Route.FORGOT_PASSWORD)}
					href="#">

					<Typography>
						<FormattedMessage id="actions.forgotPassword"/>
					</Typography>
				</Link>

				<Link onClick={() => controller.goToRoute(Route.REGISTRATION)}
					href="#">

					<Typography>
						<FormattedMessage id="actions.noAccount"/>
					</Typography>
				</Link>

				{errorBox}

				<div className={classes.loginButtonContainer}>
					<LoadingButton state={controller.loginButtonState}
						className={classes.loginButton}
						onClick={() => controller.onLogin()}>
						{loginLabel}

						<ArrowForwardIcon />
					</LoadingButton>
				</div>
			</AuthenticationTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(LoginPage));