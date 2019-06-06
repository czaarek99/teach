import * as React from "react";

import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LoadingButton from "../LoadingButton";
import InfoBox from "../InfoBox";

import { getTextFieldErrorState } from "../../validation/getErrorState";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { ILoginPageController } from "../../interfaces/controllers/ILoginPageController";
import { simpleFormat } from "../../util/simpleFormat";
import { observer } from "mobx-react";

import {
	TextField,
	Paper,
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Box,
	Typography
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	loginButton: {
		width: 150
	},

	loginText: {
		fontWeight: 600
	},

	errorBox: {
		backgroundColor: theme.palette.error.main
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
			classes,
			controller,
			intl
		} = this.props;

		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const loginLabel = simpleFormat(this, "actions.logIn");

		const disabled = controller.loading;

		const margin = "10px";

		let errorBox = null;

		if(controller.errorMessage !== null) {
			errorBox = (
				<InfoBox type="error">
					<Typography>
						<FormattedMessage id={controller.errorMessage}/>
					</Typography>
				</InfoBox>
			);
		}

		return (
			<Box display="flex"
				justifyContent="center"
				alignItems="center"
				height="100%">

				<Box width="300px">
					<Paper>
						<Box padding="10px">
							<Box marginBottom={margin}
								display="flex"
								justifyContent="center">

								<Typography className={classes.loginText}>
									{loginLabel}
								</Typography>
							</Box>

							<Box marginBottom={margin}>
								<TextField variant="outlined"
									disabled={disabled}
									value={controller.model.email}
									fullWidth={true}
									label={emailLabel}
									required={true}
									onChange={event => controller.onChange("email", event.target.value)}
									{...getTextFieldErrorState(
										intl,
										controller.errorModel,
										"email",
										{
											value: emailLabel
										}
									)}
								/>
							</Box>

							<Box marginBottom={margin}>
								<TextField variant="outlined"
									disabled={disabled}
									value={controller.model.password}
									fullWidth={true}
									label={passwordLabel}
									required={true}
									onChange={event => controller.onChange("password", event.target.value)}
									{...getTextFieldErrorState(
										intl,
										controller.errorModel,
										"password",
										{
											value: passwordLabel
										}
									)}
								/>
							</Box>

							{errorBox}

							<Box justifyContent="flex-end"
								display="flex"
								marginTop={margin}>

								<LoadingButton state={controller.loginButtonState}
									onClick={() => controller.onLogin()}
									className={classes.loginButton}>
									{loginLabel}

									<ArrowForwardIcon />
								</LoadingButton>
							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		)
	}
}

export default withStyles(styles)(injectIntl(LoginPage));