import * as React from "react";

import TextField, { TextFieldProps } from "@material-ui/core/TextField";

import { InputAdornment } from "@material-ui/core";
import { InjectedIntlProps, MessageValue, injectIntl } from "react-intl";
import { ErrorModel, ErrorState } from "../../../validation/ErrorModel";
import { observer } from "mobx-react";

export const CUSTOM_TEXT_FIELD_DEFAULT_VARIANT = "outlined";

interface ITranslationValues {
	[key: string]: MessageValue
}

export type CustomTextFieldProps<T extends ErrorState> = Omit<TextFieldProps, "variant"> & {
	variant?: "standard" | "filled" | "outlined",
	maxLength?: number
	minLength?: number
	startAdornment?: React.ReactNode
	endAndornment?: React.ReactNode

	errorModel?: ErrorModel<T>
	validationKey?: keyof T
	errorTranslationValues?: ITranslationValues
};

@observer
export class CustomTextField<T extends ErrorState = {}> extends React.Component<
	CustomTextFieldProps<T> &
	InjectedIntlProps
> {

	public static defaultProps: Partial<CustomTextFieldProps<any>> =  {
		variant: CUSTOM_TEXT_FIELD_DEFAULT_VARIANT,
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
			intl,
			errorModel,
			validationKey,
			errorTranslationValues,
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

		let translatedError = null;

		if(errorModel) {
			if(validationKey === undefined) {
				throw new Error("Please provide a validation key");
			}

			const error = errorModel.getFirstKeyError(validationKey);

			if(error !== null) {
				translatedError = intl.formatMessage	({
					id: error
				}, errorTranslationValues ? errorTranslationValues : {});
			}
		}

		return (
			<TextField { ...rest as any }
			error={translatedError !== null}
			helperText={translatedError}
			InputProps={{
				startAdornment: startAndorn,
				endAdornment: endAndorn,
				...InputProps
			}}
			//eslint-disable-next-line
			inputProps={{
				maxLength,
				minLength,
				...inputProps
			}}/>
		)
	}

}

export default injectIntl<CustomTextFieldProps<any>>(CustomTextField);