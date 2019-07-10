import React from "react";

import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { computed } from "mobx";
import { getNames } from "i18n-iso-countries";
import { CustomNativeSelect } from "../CustomNativeSelect";

interface ICountrySelectProps {
	value: string
	onChange: (countryCode: string) => void
}


@observer
class CountrySelect extends React.Component<
	ICountrySelectProps &
	InjectedIntlProps
> {

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

	public render() : React.ReactNode {

		const {
			value,
			onChange
		} = this.props;

		return (
			<CustomNativeSelect
				value={value}
				onChange={onChange} label={
					<FormattedMessage id="things.country"/>
				}>

				{this.selectOptions}
			</CustomNativeSelect>
		);
	}
}

export default injectIntl(CountrySelect);