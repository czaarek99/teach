import * as React from "react";
import { observer } from "mobx-react";
import { WithStyles, Theme, createStyles, Paper, withStyles } from "@material-ui/core";
import clsx from "clsx";

type InfoBoxType = "success" | "error" | "default";

interface IInfoBoxProps {
	type: InfoBoxType
}

const styles = (theme: Theme) => createStyles({
	root: {
		padding: 10,
		transition: `background-color ${theme.transitions.duration.standard}ms`,
	},

	errorBox: {
		backgroundColor: theme.palette.error.main,

		"&:hover": {
			backgroundColor: theme.palette.error.dark
		}
	},

	successBox: {
		backgroundColor: theme.palette.success.main,

		"&:hover": {
			backgroundColor: theme.palette.success.dark
		}
	}
});

@observer
class InfoBox extends React.Component<
	IInfoBoxProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			classes,
			type,
			children
		} = this.props;

		const rootClassNames = clsx(classes.root, {
			[classes.errorBox]: type === "error",
			[classes.successBox]: type === "success"
		});


		return (
			<Paper className={rootClassNames}>
				{children}
			</Paper>
		)

	}

}

export default withStyles(styles)(InfoBox);