import React from "react";
import { Theme, createStyles, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const styles = (theme: Theme) => createStyles({

});

interface IDMProps {

}

class DM extends React.Component<
	IDMProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {
		return (
			<div>

			</div>
		)
	}

}

export default withStyles(styles)(DM);