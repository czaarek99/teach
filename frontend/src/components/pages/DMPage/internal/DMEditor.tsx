import React from "react";

import { observer } from "mobx-react";
import { IDMEditorController } from "../../../../interfaces/controllers/IDMEditorController";
import { IMessage } from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	InputBase,
	Typography,
	withStyles
} from "@material-ui/core";
import { FormattedDate } from "react-intl";

const styles = (theme: Theme) => createStyles({
	root: {
		display: "flex",
		flexDirection: "column"
	},

	messageContainer: {
		flexGrow: 1,
		flexShrink: 0
	},

	message: {

	}
});

interface IDMEditorProps {
	controller: IDMEditorController
}

@observer
class DMEditor extends React.Component<
	IDMEditorProps &
	WithStyles<typeof styles>
> {

	public renderMessages() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		if(controller.convo) {
			return controller.convo.messages.map((message: IMessage) => {
				return (
					<div className={classes.message}>
						<Typography>
							{message.content}
						</Typography>

						<FormattedDate day="short"
							hour="numeric"
							minute="numeric"
							value={message.sendDate}/>
					</div>
				);
			})
		}
	}

	public render() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		return (
			<div className={classes.root}>
				<InputBase />
				<InputBase />

				<div>
					{this.renderMessages()}
				</div>

				<InputBase />
			</div>
		)
	}

}

export default withStyles(styles)(DMEditor);
