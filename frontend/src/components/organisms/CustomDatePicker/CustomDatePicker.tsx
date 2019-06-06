import * as React from "react";

import { observer } from "mobx-react";
import { MaterialUiPickersDate, DatePicker } from "@material-ui/pickers";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { CustomTextField } from "../../molecules";

interface ICustomDatePickerProps {
	value: MaterialUiPickersDate
	label?: string
	maxDate?: MaterialUiPickersDate
	minDate?: MaterialUiPickersDate
	maxDateMessage?: string
	minDateMessage?: string
	required?: boolean
	onChange: (date: MaterialUiPickersDate) => void
}

@observer
class CustomDatePicker extends React.Component<
	ICustomDatePickerProps &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			value,
			maxDate,
			minDate,
			onChange,
			minDateMessage,
			maxDateMessage,
			label,
			required,
			intl
		} = this.props;


		const okLabel = simpleFormat(this, "actions.ok");
		const cancelLabel = simpleFormat(this, "actions.cancel");

		const formatDatePickerDate = (date: MaterialUiPickersDate) : string => {
			if(date !== null) {
				return intl.formatDate(date, {
					month: "long",
					year: "numeric",
					day: "numeric"
				})
			}

			return "";
		}

		return (
			<DatePicker value={value}
				okLabel={okLabel}
				required={required}
				cancelLabel={cancelLabel}
				TextFieldComponent={CustomTextField}
				maxDate={maxDate}
				minDate={minDate}
				onChange={onChange}
				minDateMessage={minDateMessage}
				maxDateMessage={maxDateMessage}
				label={label}
				labelFunc={formatDatePickerDate}
			/>
		)
	}
}

export default injectIntl(CustomDatePicker);