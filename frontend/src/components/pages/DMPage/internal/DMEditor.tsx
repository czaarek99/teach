import React from "react";
import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { DM_MAX_LENGTH } from "common-library";
import { grey } from "@material-ui/core/colors";
import { simpleFormat } from "../../../../util/simpleFormat";

import {
	WithStyles,
	Theme,
	createStyles,
	InputBase,
	Button,
	withStyles
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	messageEditorContainer: {
		flexGrow: 1,
		flexBasis: 60,
	},

	editorActions: {
		display: "flex",
		justifyContent: "flex-end",
		margin: 5
	},

	newMessageInput: {
		borderTopColor: grey[300],
		borderTopWidth: 1,
		borderTopStyle: "solid",
		padding: 10
	},

});

interface IDMEditorProps {
	value: string
	onChange: (value: string) => void
	onSend: () => void
}

@observer
class DMEditor extends React.Component<
	IDMEditorProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			classes,
			value,
			onChange,
			onSend
		} = this.props;

		const newMessagePlaceholder = simpleFormat(this, "info.typeMessage");

		return (
			<div className={classes.messageEditorContainer}>
				<InputBase className={classes.newMessageInput}
					inputProps={{
						maxLength: DM_MAX_LENGTH
					}}
					multiline={true}
					value={value}
					onChange={(event) => onChange(event.target.value)}
					placeholder={newMessagePlaceholder}
					fullWidth={true}/>

				<div className={classes.editorActions}>
					<Button variant="contained"
						onClick={() => onSend()}
						size="small">

						<FormattedMessage id="actions.send"/>
					</Button>
				</div>
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(DMEditor));