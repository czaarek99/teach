import React from "react";

import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { FormControl, InputLabel, NativeSelect, OutlinedInput } from "@material-ui/core";
import { observable, computed } from "mobx";
import { getNames } from "i18n-iso-countries";

interface ICountrySelectProps {
	value: string
	onChange: (countryCode: string) => void
}

const SELECT_INPUT_ID = "countrySelectInput";

@observer
class CountrySelect extends React.Component<
	ICountrySelectProps &
	InjectedIntlProps
> {

	private readonly selectLabelRef = React.createRef<HTMLLabelElement>();

	@observable private selectLabelWidth = 0;

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

	private renderInput() : React.ReactNode {
		return (
			<OutlinedInput id={SELECT_INPUT_ID}
				fullWidth={true}
				labelWidth={this.selectLabelWidth} />
		)
	}

	public render() : React.ReactNode {

		const {
			value,
			onChange
		} = this.props;

		return (
			<FormControl fullWidth={true}
				variant="outlined">

				<InputLabel htmlFor={SELECT_INPUT_ID}
					required={true}
					ref={this.selectLabelRef}>

					<FormattedMessage id="things.country"/>
				</InputLabel>

				<NativeSelect value={value}
					fullWidth={true}
					input={this.renderInput()}
					onChange={event => onChange(event.target.value)}>
					{this.selectOptions}
				</NativeSelect>
			</FormControl>
		)
	}
}

export default injectIntl(CountrySelect);