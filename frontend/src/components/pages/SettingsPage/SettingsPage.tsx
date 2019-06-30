import React from 'react';
import UserIcon from "@material-ui/icons/AccountBox";
import MapIcon from "@material-ui/icons/Map";

import { observer } from "mobx-react";
import { WithStyles } from "@material-ui/styles";
import { injectIntl, InjectedIntlProps, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { CustomTextField } from "../../molecules";
import { simpleFormat } from "../../../util/simpleFormat";
import { CustomDatePicker, CountrySelect } from "../../organisms";

import {
	ISettingsPageController
} from "../../../interfaces/controllers/pages/ISettingsPageController";

import {
	FIRST_NAME_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	getUserMaxDate,
	STATE_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH
} from "common-library";

import {
	Theme,
	createStyles,
	withStyles,
	Paper,
	Typography,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	titlePaper: {
		padding: 10
	},

	normalPaper: {
		marginTop: 10,
		padding: 10
	},

	saveButtonContainer: {
		display: "flex",
		justifyContent: "flex-end",
		marginTop: 10
	},

	fieldContainer: {
		maxWidth: 300
	},

	resetButton: {
		marginRight: 10
	},

	countrySelectContainer: {
		marginTop: 10
	}
});

interface ISettingsPageProps {
	controller: ISettingsPageController
	navbarController: INavbarController
}

@observer
class SettingsPage extends React.Component<
	InjectedIntlProps &
	ISettingsPageProps &
	WithStyles<typeof styles>
> {

	private renderActionButtons(onSave: () => void, onReset: () => void) : React.ReactNode {
		const {
			classes
		} = this.props;

		return (
			<div className={classes.saveButtonContainer}>
				<Button variant="contained"
					onClick={() => onReset()}
					className={classes.resetButton}>

					<FormattedMessage id="actions.reset"/>
				</Button>
				<Button variant="contained"
					onClick={() => onSave()}>

					<FormattedMessage id="actions.save"/>
				</Button>
			</div>
		)
	}

	public render() : React.ReactNode {

		const {
			controller,
			navbarController,
			classes
		} = this.props;

		const isDisabled = controller.loading;

		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const birthDateLabel = simpleFormat(this, "things.birthDate");

		const cityLabel = simpleFormat(this, "things.city");
		const zipCodeLabel = simpleFormat(this, "things.zipCode");
		const streetLabel = simpleFormat(this, "things.street");
		const stateLabel = simpleFormat(this, "things.state");

		return (
			<NavbarTemplate controller={navbarController}>
				<div>
					<Paper className={classes.titlePaper}>
						<Typography variant="h4">
							<FormattedMessage id="things.pages.settings"/>
						</Typography>
					</Paper>

					<Paper className={classes.normalPaper}>
						<Typography variant="h5">
							<FormattedMessage id="things.account" />
						</Typography>

						<div className={classes.fieldContainer}>
							<CustomTextField disabled={isDisabled}
								value={controller.accountViewModel.firstName}
								minLength={FIRST_NAME_MIN_LENGTH}
								maxLength={FIRST_NAME_MAX_LENGTH}
								label={firstNameLabel}
								required={true}
								onChange={event => controller.onAccountChange("firstName", event.target.value)}
								startAdornment={ <UserIcon /> }
								errorModel={controller.accountErrorModel}
								validationKey="firstName"
								errorTranslationValues={{
									value: firstNameLabel,
									minLength: FIRST_NAME_MIN_LENGTH,
									maxLength: FIRST_NAME_MAX_LENGTH
								}}
							/>

							<CustomTextField disabled={isDisabled}
								value={controller.accountViewModel.lastName}
								minLength={LAST_NAME_MIN_LENGTH}
								maxLength={LAST_NAME_MAX_LENGTH}
								label={lastNameLabel}
								required={true}
								onChange={event => controller.onAccountChange("lastName", event.target.value)}
								startAdornment={ <UserIcon /> }
								errorModel={controller.accountErrorModel}
								validationKey="lastName"
								errorTranslationValues={{
									value: firstNameLabel,
									minLength: LAST_NAME_MIN_LENGTH,
									maxLength: LAST_NAME_MAX_LENGTH
								}}
							/>

							<CustomDatePicker value={controller.accountViewModel.birthDate}
								disabled={isDisabled}
								required={true}
								label={birthDateLabel}
								maxDate={getUserMaxDate()}
								onChange={date => controller.onAccountChange("birthDate", date)}
							/>

							{
								this.renderActionButtons(
									controller.onAccountSave,
									controller.onAccountReset
								)
							}
						</div>
					</Paper>

					<Paper className={classes.normalPaper}>
						<Typography variant="h5">
							<FormattedMessage id="things.address"/>
						</Typography>

						<div className={classes.fieldContainer}>

							<CustomTextField disabled={isDisabled}
								value={controller.addressViewModel.street}
								minLength={STREET_MIN_LENGTH}
								maxLength={STREET_MAX_LENGTH}
								label={streetLabel}
								required={true}
								onChange={event => controller.onAddressChange("street", event.target.value)}
								startAdornment={ <MapIcon/> }
								errorModel={controller.addressErrorModel}
								validationKey="street"
								errorTranslationValues={{
									value: streetLabel,
									minLength: STREET_MIN_LENGTH,
									maxLength: STREET_MAX_LENGTH
								}}
							/>

							<CustomTextField disabled={isDisabled}
								value={controller.addressViewModel.city}
								minLength={CITY_MIN_LENGTH}
								maxLength={CITY_MAX_LENGTH}
								label={cityLabel}
								required={true}
								onChange={event => controller.onAddressChange("city", event.target.value)}
								startAdornment={ <MapIcon/> }
								errorModel={controller.addressErrorModel}
								validationKey="city"
								errorTranslationValues={{
									value: cityLabel,
									minLength: CITY_MIN_LENGTH,
									maxLength: CITY_MAX_LENGTH
								}}
							/>

							<CustomTextField disabled={isDisabled}
								value={controller.addressViewModel.zipCode}
								minLength={ZIP_CODE_MIN_LENGTH}
								maxLength={ZIP_CODE_MAX_LENGTH}
								label={zipCodeLabel}
								required={true}
								onChange={event => controller.onAddressChange("zipCode", event.target.value)}
								startAdornment={ <MapIcon/> }
								errorModel={controller.addressErrorModel}
								validationKey="zipCode"
								errorTranslationValues={{
									value: zipCodeLabel,
									minLength: ZIP_CODE_MIN_LENGTH,
									maxLength: ZIP_CODE_MAX_LENGTH
								}}
							/>

							<CustomTextField disabled={isDisabled}
								value={controller.addressViewModel.state}
								maxLength={STATE_MAX_LENGTH}
								label={stateLabel}
								onChange={event => controller.onAddressChange("state", event.target.value)}
								startAdornment={ <MapIcon/> }
								errorModel={controller.addressErrorModel}
								validationKey="state"
								errorTranslationValues={{
									value: stateLabel,
								}}
							/>

							<div className={classes.countrySelectContainer}>
								<CountrySelect value={controller.addressViewModel.countryCode}
									onChange={value => controller.onAddressChange("countryCode", value)}/>
							</div>

							{
								this.renderActionButtons(
									controller.onAccountSave,
									controller.onAddressReset
								)
							}
						</div>
					</Paper>
				</div>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(SettingsPage))