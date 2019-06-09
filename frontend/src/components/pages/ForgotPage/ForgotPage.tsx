import * as React from "react";

import MailIcon from "@material-ui/icons/Mail";

import { IForgotPageController } from "../../../interfaces/controllers/pages/IForgotPageController";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { observer } from "mobx-react";
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from "common-library";
import { LoadingButton, CustomTextField, InfoBox } from "../../molecules";
import { CustomCaptcha } from "../../organisms";
import { AuthenticationTemplate, AUTHENTICATION_MARGIN } from "../../templates";

import {
	Theme,
	createStyles,
	WithStyles,
	Typography,
	withStyles
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	forgotButtonContainer: {
		marginTop: AUTHENTICATION_MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	recaptchaContainer: {
		marginTop: AUTHENTICATION_MARGIN
	},

	messageBox: {
		marginTop: AUTHENTICATION_MARGIN
	}
});

interface IForgotPageProps {
	controller: IForgotPageController
}

@observer
class ForgotPage extends React.Component<
	IForgotPageProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes,
		} = this.props;

		const isDisabled = controller.loading || controller.done;

		const resetPasswordLabel = simpleFormat(this, "actions.resetPassword");
		const emailLabel = simpleFormat(this, "things.email");

		const captchaError = controller.errorModel.getFirstKeyError("captcha");
		let translatedCaptchaError;

		if(captchaError) {
			translatedCaptchaError = this.props.intl.formatMessage({
				id: captchaError
			}, {
				value: "Captcha"
			})
		}

		let messageBox = null;
		if(controller.infoBoxMessage) {
			messageBox = (
				<InfoBox type={controller.infoBoxType}
					className={classes.messageBox}>

					<Typography>
						<FormattedMessage id={controller.infoBoxMessage} values={{
							email: controller.model.email
						}}/>
					</Typography>
				</InfoBox>
			)
		}

		return (
			<AuthenticationTemplate title={simpleFormat(this, "actions.forgotPassword")}>
				<CustomTextField disabled={isDisabled}
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
						value: emailLabel,
						minLength: EMAIL_MIN_LENGTH
					}}
				/>

				<div className={classes.recaptchaContainer}>
					<CustomCaptcha onChange={value => controller.onChange("captcha", value)}
						onFunctions={functions => controller.onFunctions(functions)}
						error={translatedCaptchaError}/>
				</div>

				{ messageBox }

				<div className={classes.forgotButtonContainer}>
					<LoadingButton state={controller.forgotButtonState}
						onClick={() => controller.onSubmit()}>
						{resetPasswordLabel}

					</LoadingButton>
				</div>
			</AuthenticationTemplate>
		);
	}

}

export default withStyles(styles)(injectIntl(ForgotPage))