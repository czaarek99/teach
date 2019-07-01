import React from 'react';
import UserIcon from "@material-ui/icons/AccountBox";
import PhoneIcon from "@material-ui/icons/Phone";
import ActionButtons from "./ActionButtons";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { WithStyles, Theme, createStyles, withStyles, Paper, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomDatePicker } from "../../../organisms";

import {
	FIRST_NAME_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	getUserMaxDate,
	PHONE_NUMBER_MAX_LENGTH
} from "common-library";

import {
	IPersonalInformationSettingsController
} from "../../../../interfaces/controllers/settings/IPersonalInformationSettingsController";

interface IPersonalInformationSettingsProps {
	controller: IPersonalInformationSettingsController
}

const styles = (theme: Theme) => createStyles({
	normalPaper: {
		marginTop: 10,
		padding: 10
	},

	fieldContainer: {
		maxWidth: 300
	},
});

@observer
class PersonalInformationSettings extends React.Component<
	InjectedIntlProps &
	IPersonalInformationSettingsProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const birthDateLabel = simpleFormat(this, "things.birthDate");
		const phoneNumberLabel = simpleFormat(this, "things.phoneNumber");

		const isDisabled = controller.loading;

		return (
			<Paper className={classes.normalPaper}>
				<Typography variant="h5">
					<FormattedMessage id="things.personalInformation" />
				</Typography>

				<div className={classes.fieldContainer}>
					<CustomTextField disabled={isDisabled}
						value={controller.viewModel.firstName}
						minLength={FIRST_NAME_MIN_LENGTH}
						maxLength={FIRST_NAME_MAX_LENGTH}
						label={firstNameLabel}
						required={true}
						onChange={event => controller.onChange("firstName", event.target.value)}
						startAdornment={ <UserIcon /> }
						errorModel={controller.errorModel}
						validationKey="firstName"
						errorTranslationValues={{
							value: firstNameLabel,
							minLength: FIRST_NAME_MIN_LENGTH,
							maxLength: FIRST_NAME_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						value={controller.viewModel.lastName}
						minLength={LAST_NAME_MIN_LENGTH}
						maxLength={LAST_NAME_MAX_LENGTH}
						label={lastNameLabel}
						required={true}
						onChange={event => controller.onChange("lastName", event.target.value)}
						startAdornment={ <UserIcon /> }
						errorModel={controller.errorModel}
						validationKey="lastName"
						errorTranslationValues={{
							value: firstNameLabel,
							minLength: LAST_NAME_MIN_LENGTH,
							maxLength: LAST_NAME_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						type="tel"
						value={controller.viewModel.phoneNumber}
						maxLength={PHONE_NUMBER_MAX_LENGTH}
						label={phoneNumberLabel}
						onChange={event => controller.onChange("phoneNumber", event.target.value)}
						startAdornment={ <PhoneIcon /> }
						errorModel={controller.errorModel}
						validationKey="phoneNumber"
						errorTranslationValues={{
							value: phoneNumberLabel,
							maxLength: PHONE_NUMBER_MAX_LENGTH
						}}
					/>

					<CustomDatePicker value={controller.viewModel.birthDate}
						disabled={isDisabled}
						required={true}
						label={birthDateLabel}
						maxDate={getUserMaxDate()}
						onChange={date => controller.onChange("birthDate", date)}
					/>

					<ActionButtons onSave={() => controller.onSave()}
						onReset={() => controller.onReset()}
						saveButtonState={controller.saveButtonState}/>

				</div>
			</Paper>
		)
	}

}

export default withStyles(styles)(injectIntl(PersonalInformationSettings));
