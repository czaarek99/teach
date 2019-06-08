import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles, Paper, Typography } from "@material-ui/core";
import { InjectedIntlProps, injectIntl } from "react-intl";

interface IAuthenticationTemplateProps {
	title: string
}

export const AUTHENTICATION_MARGIN = "10px";
const PADDING = 40;

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: `calc(100vh - ${PADDING}px * 2)`,
		padding: PADDING
	},

	formContainer: {
		width: 300,
		padding: 10
	},

	titleContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: AUTHENTICATION_MARGIN
	},

});

export class AuthenticationTemplate extends React.Component<
	IAuthenticationTemplateProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			classes,
			title,
			children
		} = this.props;

		return (
			<div className={classes.root}>
				<Paper elevation={4}
					className={classes.formContainer}>
					<div className={classes.titleContainer}>
						<Typography variant="h5">
							{title}
						</Typography>
					</div>

					{children}
				</Paper>
			</div>
		);
	}

}

export default withStyles(styles)(injectIntl(AuthenticationTemplate));