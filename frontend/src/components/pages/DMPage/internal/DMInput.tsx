import React from "react";
import clsx from "clsx";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage, MessageValue } from "react-intl";
import { ErrorModel, ErrorState } from "../../../../validation";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	InputBase,
	Typography
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	root: {
		width: "100%"
	},

	inputAdorn: {
		marginLeft: 5
	},

	input: {
		padding: 10,
	},

	helperText: {
		margin: "0 12px",
		fontSize: 11,
		color: theme.palette.error.main
	}

});

interface ITranslationValues {
	[key: string]: MessageValue
}

interface IDMInputProps<T extends ErrorState> {
	label: string
	value: string
	placeholder: string
	className: string
	type?: string
	inputProps?: object
	errorModel?: ErrorModel<T>
	validationKey?: keyof T
	errorTranslationValues?: ITranslationValues

	onClick?: () => void
	onChange: (value: string) => void
}

@observer
class DMInput<T extends ErrorState = {}> extends React.Component<
	IDMInputProps<T> &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			value,
			onClick,
			type,
			onChange,
			placeholder,
			classes,
			className,
			label,
			inputProps,
			intl,
			errorModel,
			validationKey,
			errorTranslationValues
		} = this.props;

		let translatedErrorComponent = null;

		if(errorModel) {
			if(validationKey === undefined) {
				throw new Error("Please provide a validation key");
			}

			const error = errorModel.getFirstKeyError(validationKey);

			if(error !== null) {
				const translatedError = intl.formatMessage({
					id: error
				}, errorTranslationValues ? errorTranslationValues : {});

				translatedErrorComponent = (
					<Typography className={classes.helperText}>
						{translatedError}
					</Typography>
				);
			}
		}

		const rootClassNames = clsx(className, classes.root);

		return (
			<div className={rootClassNames}>
				<InputBase value={value}
					error={translatedErrorComponent !== null}
					fullWidth={true}
					onClick={onClick}
					type={type}
					classes={{
						inputAdornedStart: classes.inputAdorn
					}}
					inputProps={inputProps}
					startAdornment={
						<React.Fragment>
							{label}
							<span>:</span>
						</React.Fragment>
					}
					placeholder={placeholder}
					className={classes.input}
					onChange={(event) => onChange(event.target.value)}
				/>

				 {translatedErrorComponent}
			</div>
		);
	}

}

export default withStyles(styles)(injectIntl(DMInput));