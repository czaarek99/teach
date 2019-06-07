import * as React from "react";

import MailIcon from "@material-ui/icons/Mail";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import KeyIcon from "@material-ui/icons/VpnKey";

import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { observer } from "mobx-react";
import { PASSWORD_MAX_LENGTH, EMAIL_MAX_LENGTH } from "common-library";
import { InfoBox, CustomTextField, LoadingButton } from "../../molecules";

import {
	ILoginPageController,
} from "../../../interfaces/controllers/ILoginPageController";

import {
	Paper,
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
} from "@material-ui/core";

const MARGIN = 10;

const styles = (theme: Theme) => createStyles({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%"
	},

	formContainer: {
		width: 300,
		padding: 10
	},

	titleContainer: {
		display: "flex",
		justifyContent: "center"
	},

	textField: {
		marginBottom: MARGIN
	},

	loginButtonContainer: {
		marginTop: MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	errorBox: {
		marginTop: MARGIN
	}


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
			<div className={classes.root}>
				<Paper className={classes.formContainer}>
					<div className={classes.titleContainer}>
						<Typography variant="h5">
							{loginLabel}
						</Typography>
					</div>

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

					{errorBox}

					<div className={classes.loginButtonContainer}>
						<LoadingButton state={controller.loginButtonState}
							onClick={() => controller.onLogin()}>
							{loginLabel}

							<ArrowForwardIcon />
						</LoadingButton>
					</div>
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(LoginPage));