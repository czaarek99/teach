import * as React from "react";

import PersonalInformationContent from "./internal/PersonalInformationContent";
import AccountDetailsContent from "./internal/AccountDetailsContent";
import AddressContent from "./internal/AddressContent";

import { observer, inject } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { InfoBox, LoadingButton } from "../../molecules";
import { CustomCaptcha } from "../../organisms";

import {
	AuthenticationTemplate, AUTHENTICATION_MARGIN
} from "../../templates/";

import {
	IRegistrationPageController
} from "../../../interfaces/controllers/pages/IRegistrationPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	registerButtonContainer: {
		marginTop: AUTHENTICATION_MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	errorBox: {
		marginTop: AUTHENTICATION_MARGIN
	}
});

export interface IRegistrationContentProps {
	margin: string
	isDisabled: boolean
	controller: IRegistrationPageController
}

interface IRegistrationPageProps {
	controller: IRegistrationPageController
}

@inject("routingStore")
@observer
class RegistrationPage extends React.Component<
	IRegistrationPageProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		const isDisabled = controller.loading;
		const registerLabel = simpleFormat(this, "actions.register");

		let errorBox = null;

		if(controller.errorMessage !== null) {
			errorBox = (
				<InfoBox type="error" className={classes.errorBox}>
					<Typography>
						<FormattedMessage id={controller.errorMessage}/>
					</Typography>
				</InfoBox>
			);
		}

		const captchaError = controller.registrationErrorModel.getFirstKeyError("captcha");
		let translatedCaptchaError;

		if(captchaError) {
			translatedCaptchaError = this.props.intl.formatMessage({
				id: captchaError
			}, {
				value: "Captcha"
			})
		}

		return (
			<AuthenticationTemplate title={registerLabel}>
				<PersonalInformationContent controller={controller}
					margin={AUTHENTICATION_MARGIN}
					isDisabled={isDisabled}/>

				<AccountDetailsContent controller={controller}
					margin={AUTHENTICATION_MARGIN}
					isDisabled={isDisabled}/>

				<AddressContent controller={controller}
					margin={AUTHENTICATION_MARGIN}
					isDisabled={isDisabled}/>

				<div>
					<CustomCaptcha onChange={value => controller.onChange("captcha", value)}
						error={translatedCaptchaError}/>
				</div>

				{errorBox}

				<div className={classes.registerButtonContainer}>
					<LoadingButton state={controller.registerButtonState}
						onClick={() => controller.onRegister()}>

						{registerLabel}

					</LoadingButton>
				</div>
			</AuthenticationTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(RegistrationPage));