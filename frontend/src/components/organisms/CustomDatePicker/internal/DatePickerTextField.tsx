import React from "react";

import { CustomTextField } from "../../../molecules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

class DatePickerTextField extends React.Component {

	public render() : React.ReactNode {

		return (
			<CustomTextField startAdornment={ <FontAwesomeIcon icon={faCalendar}/>}
				{...this.props} />
		)

	}

}

export default DatePickerTextField;