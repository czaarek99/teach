import * as React from "react";

import CalendarIcon from "@material-ui/icons/CalendarToday";

import { CustomTextField } from "../../../molecules";

class DatePickerTextField extends React.Component {

	public render() : React.ReactNode {

		return (
			<CustomTextField startAdornment={ <CalendarIcon />}
				{...this.props} />
		)

	}

}

export default DatePickerTextField;