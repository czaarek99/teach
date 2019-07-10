import React from "react";

import { observer } from "mobx-react";
import { observable } from "mobx";
import { v4 } from "uuid";
import { FormattedMessage } from "react-intl";

import {
	OutlinedInput,
	FormControl,
	InputLabel,
	NativeSelect,
	FormHelperText
} from "@material-ui/core";

interface ICustomNativeSelectProps {
	label: React.ReactNode
	value?: string | null
	required?: boolean
	errorMessage?: string | null
	className?: string
	disabled?: boolean
	onChange: (value: string) => void
}

@observer
class CustomNativeSelect extends React.Component<
	ICustomNativeSelectProps
> {

	private readonly selectId = v4();
	private readonly selectLabelRef = React.createRef<HTMLLabelElement>();
	@observable private selectLabelWidth = 0;

	public componentDidMount() : void {
		if(this.selectLabelRef.current) {
			this.selectLabelWidth = this.selectLabelRef.current.offsetWidth;
		}
	}

	private renderInput() : React.ReactNode {
		return (
			<OutlinedInput id={this.selectId}
				fullWidth={true}
				labelWidth={this.selectLabelWidth} />
		);
	}

	private renderError() : React.ReactNode {
		if(this.props.errorMessage) {
			return (
				<FormHelperText>
					<FormattedMessage id={this.props.errorMessage}/>
				</FormHelperText>
			);
		}
	}

	public render() : React.ReactNode {

		const {
			value,
			onChange,
			label,
			children,
			className,
			errorMessage,
			required,
			disabled
		} = this.props;

		return (
			<FormControl fullWidth={true}
				error={errorMessage ? true : false}
				className={className}
				disabled={disabled}
				variant="outlined">

				<InputLabel htmlFor={this.selectId}
					required={required}
					ref={this.selectLabelRef}>

					{label}
				</InputLabel>

				<NativeSelect value={value}
					fullWidth={true}
					input={this.renderInput()}
					onChange={event => onChange(event.target.value)}>

					{children}
				</NativeSelect>

				{this.renderError()}
			</FormControl>
		)
	}
}

export default CustomNativeSelect;