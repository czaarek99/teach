import * as React from "react";

import UserIcon from "@material-ui/icons/AccountBox";

import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util/simpleFormat";
import { getTextFieldErrorState } from "../../../../validation/getErrorState";
import { CustomDatePicker } from "../../../organisms";
import { IRegistrationContentProps } from "../RegistrationPage";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	getUserMaxDate
} from "common-library";


@observer
class PersonalInformationContent extends React.Component<
	IRegistrationContentProps &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			margin,
			controller,
			isDisabled,
			intl
		} = this.props;

		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const birthDateLabel = simpleFormat(this, "things.birthDate");

		return (
			<Box>
				<Box marginBottom={margin}
					display="flex"
					justifyContent="center">


					<Typography variant="h6">
						<FormattedMessage id="things.personalInformation"/>
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


				<Box marginBottom={margin}
					display="flex"
					justifyContent="center">

					<CustomDatePicker value={controller.registrationModel.birthDate}
						required={true}
						label={birthDateLabel}
						maxDate={getUserMaxDate()}
						onChange={date => controller.onChange("birthDate", date)}/>
				</Box>
			</Box>
		)
	}
}

export default injectIntl(PersonalInformationContent);