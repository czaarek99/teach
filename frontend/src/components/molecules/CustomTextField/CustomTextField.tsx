import * as React from "react";

import TextField, { TextFieldProps } from "@material-ui/core/TextField";
import { Omit, InputAdornment } from "@material-ui/core";

type CustomTextFieldProps = Omit<TextFieldProps, "variant"> & {
	variant?: "standard" | "filled" | "outlined",
	maxLength?: number
	minLength?: number
	startAdornment?: React.ReactNode
	endAndornment?: React.ReactNode
};

export class CustomTextField extends React.Component<CustomTextFieldProps> {

	public static defaultProps: Partial<CustomTextFieldProps> =  {
		variant: "outlined",
		fullWidth: true
	}

	public render() : React.ReactNode {

		const {
			maxLength,
			minLength,
			startAdornment,
			endAndornment,
			inputProps,
			InputProps,
			...rest
		} = this.props;

		let startAndorn = null;
		let endAndorn = null;

		if(startAdornment) {
			startAndorn = (
				<InputAdornment position="start">
					{startAdornment}
				</InputAdornment>
			);
		}

		if(endAndornment) {
			endAndorn = (
				<InputAdornment position="end">
					{endAndornment}
				</InputAdornment>
			)
		}

		return (
			<TextField { ...rest as any }
			InputProps={{
				startAdornment: startAndorn,
				endAdornment: endAndorn,
				...InputProps
			}}
			inputProps={{
				maxLength,
				minLength,
				...inputProps
			}}/>
		)
	}

}

export default CustomTextField;