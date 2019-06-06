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
	Box,
	Typography,
} from "@material-ui/core";


const styles = (theme: Theme) => createStyles({

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

								<Typography variant="h5">
									{loginLabel}
								</Typography>
							</Box>

							<Box marginBottom={margin}>
								<CustomTextField disabled={disabled}
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
							</Box>

							<Box marginBottom={margin}>
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
							</Box>

							{errorBox}

							<Box justifyContent="flex-end"
								display="flex"
								marginTop={margin}>

								<LoadingButton state={controller.loginButtonState}
									onClick={() => controller.onLogin()}>
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