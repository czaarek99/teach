import * as React from "react";

import MapIcon from "@material-ui/icons/Map";

import { observer } from "mobx-react";
import { IRegistrationContentProps } from "../RegistrationPage";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomTextField } from "../../../molecules";
import { computed, observable } from "mobx";
import { getNames } from "i18n-iso-countries";

import {
	Box,
	Typography,
	FormControl,
	InputLabel,
	NativeSelect,
	OutlinedInput
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

const SELECT_INPUT_ID = "countrySelectInput";

@observer
class AddressContent extends React.Component<
	IRegistrationContentProps &
	InjectedIntlProps
> {

	@observable private selectLabelWidth = 0;
	private readonly selectLabelRef = React.createRef<HTMLLabelElement>();

	@computed private get selectOptions() : React.ReactNodeArray {
		const locale = this.props.intl.locale;
		const countries = getNames(locale);

		return Object.entries(countries).map(([code, name]) => {
			return (
				<option value={code}
					key={code}>

					{name}
				</option>
			)
		})
	}

	public componentDidMount() : void {
		if(this.selectLabelRef.current) {
			this.selectLabelWidth = this.selectLabelRef.current.offsetWidth;
		}
	}

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
						startAdornment={ <MapIcon/> }
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
						startAdornment={ <MapIcon/> }
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
						startAdornment={ <MapIcon/> }
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
						startAdornment={ <MapIcon/> }
						errorModel={controller.errorModel}
						validationKey="state"
						errorTranslationValues={{
							value: stateLabel,
						}}
					/>
				</Box>


				<Box mb={margin}>
					<FormControl fullWidth={true}
						variant="outlined">

						<InputLabel htmlFor={SELECT_INPUT_ID}
							required={true}
							ref={this.selectLabelRef}>

							<FormattedMessage id="things.country"/>
						</InputLabel>

						<NativeSelect value={controller.model.countryCode}
							fullWidth={true}
							input={(
								<OutlinedInput id={SELECT_INPUT_ID}
									fullWidth={true}
									labelWidth={this.selectLabelWidth} />
							)}
							onChange={event => controller.onChange("countryCode", event.target.value)}>
							{this.selectOptions}
						</NativeSelect>
					</FormControl>
				</Box>

			</Box>
		)
	}

}

export default injectIntl(AddressContent);