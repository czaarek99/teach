import React from "react";

import { observer } from "mobx-react";
import { IRegistrationContentProps } from "../RegistrationPage";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { simpleFormat } from "../../../../util";
import { CustomTextField } from "../../../molecules";
import { CountrySelect } from "../../../organisms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap } from "@fortawesome/free-solid-svg-icons";

import {
	Box,
	Typography,
} from "@material-ui/core";

import {
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	STATE_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	ZIP_CODE_MAX_LENGTH
} from "common-library";

@observer
class AddressContent extends React.Component<
	IRegistrationContentProps &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			margin,
			isDisabled
		} = this.props;

		const cityLabel = simpleFormat(this, "things.city");
		const zipCodeLabel = simpleFormat(this, "things.zipCode");
		const streetLabel = simpleFormat(this, "things.street");
		const stateLabel = simpleFormat(this, "things.state");

		const mapIcon = (
			<FontAwesomeIcon icon={faMap}/>
		);

		return (
			<Box>
				<Box mb={margin}
					display="flex"
					justifyContent="center">


					<Typography variant="h6">
						<FormattedMessage id="things.address"/>
					</Typography>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.street}
						minLength={STREET_MIN_LENGTH}
						maxLength={STREET_MAX_LENGTH}
						label={streetLabel}
						required={true}
						onChange={event => controller.onChange("street", event.target.value)}
						startAdornment={mapIcon}
						errorModel={controller.errorModel}
						validationKey="street"
						errorTranslationValues={{
							value: streetLabel,
							minLength: STREET_MIN_LENGTH,
							maxLength: STREET_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.city}
						minLength={CITY_MIN_LENGTH}
						maxLength={CITY_MAX_LENGTH}
						label={cityLabel}
						required={true}
						onChange={event => controller.onChange("city", event.target.value)}
						startAdornment={mapIcon}
						errorModel={controller.errorModel}
						validationKey="city"
						errorTranslationValues={{
							value: cityLabel,
							minLength: CITY_MIN_LENGTH,
							maxLength: CITY_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.zipCode}
						minLength={ZIP_CODE_MIN_LENGTH}
						maxLength={ZIP_CODE_MAX_LENGTH}
						label={zipCodeLabel}
						required={true}
						onChange={event => controller.onChange("zipCode", event.target.value)}
						startAdornment={mapIcon}
						errorModel={controller.errorModel}
						validationKey="zipCode"
						errorTranslationValues={{
							value: zipCodeLabel,
							minLength: ZIP_CODE_MIN_LENGTH,
							maxLength: ZIP_CODE_MAX_LENGTH
						}}
					/>
				</Box>

				<Box mb={margin}>
					<CustomTextField disabled={isDisabled}
						value={controller.model.state}
						maxLength={STATE_MAX_LENGTH}
						label={stateLabel}
						onChange={event => controller.onChange("state", event.target.value)}
						startAdornment={mapIcon}
						errorModel={controller.errorModel}
						validationKey="state"
						errorTranslationValues={{
							value: stateLabel,
						}}
					/>
				</Box>


				<Box mb={margin} hidden={true}>
					<CountrySelect value={controller.model.countryCode}
						disabled={true}
						onChange={value => controller.onChange("countryCode", value)}/>
				</Box>

			</Box>
		)
	}

}

export default injectIntl(AddressContent);