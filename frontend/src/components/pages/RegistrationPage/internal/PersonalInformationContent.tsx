import React from 'react';

import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { Box, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomDatePicker } from "../../../organisms";
import { IRegistrationContentProps } from "../RegistrationPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignature, faPhone } from "@fortawesome/free-solid-svg-icons";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	getUserMaxDate,
	PHONE_NUMBER_MAX_LENGTH
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
		} = this.props;

		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const birthDateLabel = simpleFormat(this, "things.birthDate");
		const phoneNumberLabel = simpleFormat(this, "things.phoneNumber");

		const signatureIcon = (
			<FontAwesomeIcon icon={faSignature}/>
		);

		return (
			<Box>
				<Box mb={margin}
					display="flex"
					justifyContent="center">


					<Typography variant="h6">
						<FormattedMessage id="things.personalInformation"/>
					</Typography>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.firstName}
						minLength={FIRST_NAME_MIN_LENGTH}
						maxLength={FIRST_NAME_MAX_LENGTH}
						label={firstNameLabel}
						required={true}
						onChange={event => controller.onChange("firstName", event.target.value)}
						startAdornment={signatureIcon}
						errorModel={controller.errorModel}
						validationKey="firstName"
						errorTranslationValues={{
							value: firstNameLabel,
							minLength: FIRST_NAME_MIN_LENGTH,
							maxLength: FIRST_NAME_MAX_LENGTH
						}}
					/>

				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.lastName}
						minLength={LAST_NAME_MIN_LENGTH}
						maxLength={LAST_NAME_MAX_LENGTH}
						label={lastNameLabel}
						required={true}
						onChange={event => controller.onChange("lastName", event.target.value)}
						startAdornment={signatureIcon}
						errorModel={controller.errorModel}
						validationKey="lastName"
						errorTranslationValues={{
							value: lastNameLabel,
							minLength: LAST_NAME_MIN_LENGTH,
							maxLength: LAST_NAME_MAX_LENGTH
						}}
					/>

				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						type="tel"
						value={controller.model.phoneNumber}
						maxLength={PHONE_NUMBER_MAX_LENGTH}
						label={phoneNumberLabel}
						onChange={event => controller.onChange("phoneNumber", event.target.value)}
						startAdornment={ <FontAwesomeIcon icon={faPhone}/> }
						errorModel={controller.errorModel}
						validationKey="phoneNumber"
						errorTranslationValues={{
							value: phoneNumberLabel,
							maxLength: PHONE_NUMBER_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}
					display="flex"
					justifyContent="center">

					<CustomDatePicker value={controller.model.birthDate}
						disabled={isDisabled}
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