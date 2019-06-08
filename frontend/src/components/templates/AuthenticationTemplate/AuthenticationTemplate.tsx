import * as React from "react";
import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { InjectedIntlProps } from "react-intl";

interface IAuthenticationTemplateProps {
	title: string
}

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		padding: 40
	},

	formContainer: {
		width: 300,
		padding: 10
	},

	titleContainer: {
		display: "flex",
		justifyContent: "center"
	},

});

export class AuthenticationTemplate extends React.Component<
	IAuthenticationTemplateProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {
		return <div></div>
	}

}

export default withStyles(styles)(AuthenticationTemplate);