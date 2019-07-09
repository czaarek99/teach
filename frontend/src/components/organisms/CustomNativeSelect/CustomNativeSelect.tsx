import React from "react";

import { observer } from "mobx-react";
import { observable } from "mobx";
import { v4 } from "uuid";

import {
	OutlinedInput,
	FormControl,
	InputLabel,
	NativeSelect
} from "@material-ui/core";

interface ICustomNativeSelectProps {
	label: string
	value: string
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


	public render() : React.ReactNode {

		const {
			value,
			onChange,
			label,
			children
		} = this.props;

		return (
			<FormControl fullWidth={true}
				variant="outlined">

				<InputLabel htmlFor={this.selectId}
					required={true}
					ref={this.selectLabelRef}>

					{label}
				</InputLabel>

				<NativeSelect value={value}
					fullWidth={true}
					input={this.renderInput()}
					onChange={event => onChange(event.target.value)}>

					{children}
				</NativeSelect>
			</FormControl>
		)
	}
}

export default CustomNativeSelect;