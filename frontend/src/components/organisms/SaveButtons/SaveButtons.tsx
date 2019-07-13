import React from 'react';

import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { WithStyles, Theme, createStyles, Button, withStyles } from "@material-ui/core";
import { observer } from "mobx-react";
import { LoadingButtonState, LoadingButton } from "../../molecules";

const styles = (theme: Theme) => createStyles({

	saveButtonContainer: {
		marginTop: 10
	},

	resetButton: {
		marginLeft: 10
	},

})

interface ISaveButtonsProps {
	onSave: () => void
	onReset: () => void
	showReset: boolean
	saveButtonState: LoadingButtonState
}

@observer
class SaveButtons extends React.Component<
	ISaveButtonsProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			onSave,
			onReset,
			saveButtonState,
			showReset,
			classes
		} = this.props;

		let resetButton = (
			<Button variant="contained"
				onClick={() => onReset()}
				className={classes.resetButton}>

				<FormattedMessage id="actions.reset"/>
			</Button>
		);

		return (
			<div className={classes.saveButtonContainer}>
				<LoadingButton state={saveButtonState}
					onClick={() => onSave()}>

					<FormattedMessage id="actions.save"/>
				</LoadingButton>

				{showReset && resetButton}
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(SaveButtons));