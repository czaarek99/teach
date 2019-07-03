import React from 'react';
import MapIcon from "@material-ui/icons/Map";
import ActionButtons from "./ActionButtons";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { WithStyles, createStyles } from "@material-ui/styles";
import { Theme, withStyles, Paper, Typography } from "@material-ui/core";
import { CustomTextField } from "../../../molecules";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CountrySelect } from "../../../organisms";

import {
	STATE_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
} from "common-library";

import {
	IAddressProfileController
} from "../../../../interfaces/controllers/profile/IAddressProfileController";

const styles = (theme: Theme) => createStyles({

	normalPaper: {
		marginTop: 10,
		padding: 10
	},

	fieldContainer: {
		maxWidth: 300
	},

	field: {
		marginBottom: 8
	}

});

interface IAddressContentProps {
	controller: IAddressProfileController
}

@observer
class AddressContent extends React.Component<
	IAddressContentProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		const isDisabled = controller.loading;

		const cityLabel = simpleFormat(this, "things.city");
		const zipCodeLabel = simpleFormat(this, "things.zipCode");
		const streetLabel = simpleFormat(this, "things.street");
		const stateLabel = simpleFormat(this, "things.state");

		return (
			<Paper className={classes.normalPaper}>
				<Typography variant="h5">
					<FormattedMessage id="things.address"/>
				</Typography>

				<div className={classes.fieldContainer}>

					<CustomTextField disabled={isDisabled}
						className={classes.field}
						value={controller.viewModel.street}
						minLength={STREET_MIN_LENGTH}
						maxLength={STREET_MAX_LENGTH}
						label={streetLabel}
						required={true}
						onChange={event => controller.onChange("street", event.target.value)}
						startAdornment={ <MapIcon/> }
						errorModel={controller.errorModel}
						validationKey="street"
						errorTranslationValues={{
							value: streetLabel,
							minLength: STREET_MIN_LENGTH,
							maxLength: STREET_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						className={classes.field}
						value={controller.viewModel.city}
						minLength={CITY_MIN_LENGTH}
						maxLength={CITY_MAX_LENGTH}
						label={cityLabel}
						required={true}
						onChange={event => controller.onChange("city", event.target.value)}
						startAdornment={ <MapIcon/> }
						errorModel={controller.errorModel}
						validationKey="city"
						errorTranslationValues={{
							value: cityLabel,
							minLength: CITY_MIN_LENGTH,
							maxLength: CITY_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						className={classes.field}
						value={controller.viewModel.zipCode}
						minLength={ZIP_CODE_MIN_LENGTH}
						maxLength={ZIP_CODE_MAX_LENGTH}
						label={zipCodeLabel}
						required={true}
						onChange={event => controller.onChange("zipCode", event.target.value)}
						startAdornment={ <MapIcon/> }
						errorModel={controller.errorModel}
						validationKey="zipCode"
						errorTranslationValues={{
							value: zipCodeLabel,
							minLength: ZIP_CODE_MIN_LENGTH,
							maxLength: ZIP_CODE_MAX_LENGTH
						}}
					/>

					<CustomTextField disabled={isDisabled}
						className={classes.field}
						value={controller.viewModel.state}
						maxLength={STATE_MAX_LENGTH}
						label={stateLabel}
						onChange={event => controller.onChange("state", event.target.value)}
						startAdornment={ <MapIcon/> }
						errorModel={controller.errorModel}
						validationKey="state"
						errorTranslationValues={{
							value: stateLabel,
						}}
					/>

					<CountrySelect value={controller.viewModel.countryCode}
						onChange={value => controller.onChange("countryCode", value)}/>

					<ActionButtons onSave={() => controller.onSave()}
						onReset={() => controller.onReset()}
						saveButtonState={controller.saveButtonState}/>
				</div>
			</Paper>
		)
	}
}

export default withStyles(styles)(injectIntl(AddressContent));