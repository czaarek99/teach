import * as React from "react";

import UserIcon from "@material-ui/icons/AccountBox";
import MailIcon from "@material-ui/icons/Mail";
import KeyIcon from "@material-ui/icons/VpnKey";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { getTextFieldErrorState } from "../../../validation/getErrorState";
import { DatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { InfoBox, CustomTextField, LoadingButton } from "../../molecules";

import {
	IRegistrationPageController
} from "../../../interfaces/controllers/IRegistrationPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Box,
	Typography,
	Paper,
} from "@material-ui/core";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	EMAIL_MIN_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
	ErrorMessage,
	getUserMaxDate,
} from "common-library";
import { CustomDatePicker } from "../../organisms";


const styles = (theme: Theme) => createStyles({

	registerText: {
		fontWeight: 600
	},


});

interface IRegistrationPageProps {
	controller: IRegistrationPageController
}

@observer
class RegistrationPage extends React.Component<
	IRegistrationPageProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes,
			intl
		} = this.props;

		const margin = "10px";
		const isDisabled = controller.loading;

		const registerLabel = simpleFormat(this, "actions.register");
		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const repeatPasswordLabel = simpleFormat(this, "actions.repeatPassword");
		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const zipCodeLabel = simpleFormat(this, "things.zipCode");
		const streetLabel = simpleFormat(this, "things.street");
		const addressLabel = simpleFormat(this, "things.address");
		const countryLabel = simpleFormat(this, "things.country");
		const stateLabel = simpleFormat(this, "things.state");
		const birthDateLabel = simpleFormat(this, "things.birthDate");

		const maxDateErrorLabel = simpleFormat(this, ErrorMessage.USER_TOO_YOUNG)

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
						<Box padding={margin}>
							<Box marginBottom={margin}
								display="flex"
								justifyContent="center">

								<Typography className={classes.registerText}
									component="h1">

									{registerLabel}
								</Typography>
							</Box>

							<Box marginBottom={margin}>
								<CustomTextField disabled={isDisabled}
									value={controller.registrationModel.firstName}
									minLength={FIRST_NAME_MIN_LENGTH}
									maxLength={FIRST_NAME_MAX_LENGTH}
									label={firstNameLabel}
									required={true}
									onChange={event => controller.onChange("firstName", event.target.value)}
									startAdornment={ <UserIcon /> }
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
										"firstName",
										{
											value: firstNameLabel
										}
									)}
								/>
							</Box>

							<Box marginBottom={margin}>
								<CustomTextField disabled={isDisabled}
									value={controller.registrationModel.lastName}
									minLength={LAST_NAME_MIN_LENGTH}
									maxLength={LAST_NAME_MAX_LENGTH}
									label={lastNameLabel}
									required={true}
									onChange={event => controller.onChange("lastName", event.target.value)}
									startAdornment={ <UserIcon /> }
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
										"lastName",
										{
											value: lastNameLabel
										}
									)}
								/>
							</Box>


							<Box marginBottom={margin} display="flex" justifyContent="center">

								<CustomDatePicker value={controller.registrationModel.birthDate}
									required={true}
									label={birthDateLabel}
									maxDate={getUserMaxDate()}
									minDateMessage={maxDateErrorLabel}
									onChange={date => controller.onChange("birthDate", date)}/>
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
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
										"email",
										{
											value: emailLabel
										}
									)}
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
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
										"password",
										{
											value: passwordLabel
										}
									)}
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
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
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

								<LoadingButton state={controller.registerButtonState}
									onClick={() => controller.onRegister()}>

									{registerLabel}

								</LoadingButton>

							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		)
	}
}

export default withStyles(styles)(injectIntl(RegistrationPage));