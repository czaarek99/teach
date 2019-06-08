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
	IRegistrationPageController
} from "../../../interfaces/controllers/IRegistrationPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
	Paper,
} from "@material-ui/core";

const MARGIN = "10px";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		padding: 40
	},

	formContainer: {
		width: 300,
		padding: 10
	},

	titleContainer: {
		display: "flex",
		justifyContent: "center"
	},

	registerButtonContainer: {
		marginTop: MARGIN,
		display: "flex",
		justifyContent: "flex-end",
	},

	errorBox: {
		marginTop: MARGIN
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
			<div className={classes.root}>
				<Paper className={classes.formContainer}
					elevation={4}>

					<div className={classes.titleContainer}>
						<Typography variant="h5">
							{registerLabel}
						</Typography>
					</div>

					<PersonalInformationContent controller={controller}
						margin={MARGIN}
						isDisabled={isDisabled}/>

					<AccountDetailsContent controller={controller}
						margin={MARGIN}
						isDisabled={isDisabled}/>

					<AddressContent controller={controller}
						margin={MARGIN}
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
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(RegistrationPage));