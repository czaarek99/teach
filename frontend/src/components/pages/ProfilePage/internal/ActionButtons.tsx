import React from 'react';
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { WithStyles, Theme, createStyles, Button, withStyles } from "@material-ui/core";
import { LoadingButtonState, LoadingButton } from "../../../molecules";
import { observer } from "mobx-react";

const styles = (theme: Theme) => createStyles({
	saveButtonContainer: {
		display: "flex",
		justifyContent: "flex-end",
		marginTop: 10
	},

	resetButton: {
		marginRight: 10
	},

})

interface IActionButtonsProps {
	onSave: () => void
	onReset: () => void
	saveButtonState: LoadingButtonState
}

@observer
class ActionButtons extends React.Component<
	IActionButtonsProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			onSave,
			onReset,
			saveButtonState,
			classes
		} = this.props;

		return (
			<div className={classes.saveButtonContainer}>
				<Button variant="contained"
					onClick={() => onReset()}
					className={classes.resetButton}>

					<FormattedMessage id="actions.reset"/>
				</Button>
				<LoadingButton state={saveButtonState}
					onClick={() => onSave()}>

					<FormattedMessage id="actions.save"/>
				</LoadingButton>
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(ActionButtons));