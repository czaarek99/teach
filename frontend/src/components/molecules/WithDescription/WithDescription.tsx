import React from "react";

import { observer } from "mobx-react";
import { Typography } from "@material-ui/core";

interface IWithDescriptionProps {
	description: string
}

@observer
export class WithDescription extends React.Component<IWithDescriptionProps> {

	public render() : React.ReactNode {

		const {
			children,
			description
		} = this.props;

		return (
			<div>
				{children}

				<Typography>

				</Typography>
			</div>
		)
	}

}

export default WithDescription;