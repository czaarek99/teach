import React from "react";
import DatePickerTextField from "./internal/DatePickerTextField";

import { observer } from "mobx-react";
import { MaterialUiPickersDate, DatePicker } from "@material-ui/pickers";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { simpleFormat } from "../../../util";
import { CustomTextField } from "../../molecules";

interface ICustomDatePickerProps {
	value?: MaterialUiPickersDate
	className?: string
	label?: React.ReactNode
	maxDate?: MaterialUiPickersDate
	minDate?: MaterialUiPickersDate
	maxDateMessage?: string
	minDateMessage?: string
	required?: boolean
	icon?: boolean
	disabled?: boolean
	onChange: (date: MaterialUiPickersDate) => void
}

@observer
class CustomDatePicker extends React.Component<
	ICustomDatePickerProps &
	InjectedIntlProps
> {

	public static defaultProps: Partial<ICustomDatePickerProps> = {
		icon: true
	}

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
			icon,
			disabled,
			intl,
			className
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

		let textFieldType : any = CustomTextField;
		if(icon) {
			textFieldType = DatePickerTextField;
		}

		return (
			<DatePicker value={value}
				className={className}
				disabled={disabled}
				okLabel={okLabel}
				required={required}
				cancelLabel={cancelLabel}
				TextFieldComponent={textFieldType}
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