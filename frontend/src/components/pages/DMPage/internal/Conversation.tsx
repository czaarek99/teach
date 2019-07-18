import React from "react";
import DMEditor from "./DMEditor";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { IConversationController } from "../../../../interfaces";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography
} from "@material-ui/core";
import { IMessage } from "common-library";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},

	messageList: {
		flexGrow: 100,
		flexShrink: 0
	},

});

interface IConversationProps {
	controller: IConversationController
}

@observer
class Conversation extends React.Component<
	IConversationProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	private renderMessages() : React.ReactNode {

		const {
			controller
		} = this.props;

		return controller.convo.messages.map((message: IMessage) => {
			return (
				<div>
					<Typography>
						{message.content}
					</Typography>
				</div>
			)
		});
	}

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		return (
			<div className={classes.root}>
				<Typography>
					{controller.convo.title}
				</Typography>

				<div className={classes.messageList}>
					{this.renderMessages()}
				</div>

				<DMEditor value={controller.model.message}
					onSend={() => controller.onSendMessage()}
					onChange={value => controller.onChange("message", value)}/>


			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(Conversation));