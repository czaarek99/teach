import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

});

export class HomePage extends React.Component<WithStyles<typeof styles>> {

	public render() : React.ReactNode {
		return (
			<p>
				Hi
			</p>
		)
	}

}

export default withStyles(styles)(HomePage);