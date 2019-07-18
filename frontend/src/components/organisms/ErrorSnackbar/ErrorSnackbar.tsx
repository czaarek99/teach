import React from 'react';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { v4 } from "uuid";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Snackbar
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},
});

interface IErrorSnackbarProps {
	errorMessage?: string
	onClose: () => void
	action: React.ReactNode
}

@observer
class ErrorSnackbar extends React.Component<
	IErrorSnackbarProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	private readonly key : string = v4();

	public render() : React.ReactNode {

		const {
			errorMessage,
			onClose,
			action,
			classes
		} = this.props;

		let message;
		if(errorMessage) {
			message = (
				<FormattedMessage id={errorMessage}/>
			);
		}

		return (
			<Snackbar open={errorMessage ? true : false}
				key={this.key}
				ContentProps={{
					className: classes.errorSnackbarContent
				}}
				action={action}
				message={message}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				onClose={() => onClose()}
			/>
		)
	}

}

export default withStyles(styles)(injectIntl(ErrorSnackbar));