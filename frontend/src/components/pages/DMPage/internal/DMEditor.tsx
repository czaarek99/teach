import React from "react";
import clsx from "clsx";

import { observer } from "mobx-react";
import { IDMEditorController } from "../../../../interfaces/controllers/IDMEditorController";
import { IMessage } from "common-library";
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { grey } from "@material-ui/core/colors";
import { simpleFormat } from "../../../../util/simpleFormat";

import {
	Theme,
	createStyles,
	WithStyles,
	InputBase,
	Typography,
	withStyles,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},

	input: {
		padding: 10,
	},

	topInput: {
		borderBottomColor: grey[300],
		borderBottomWidth: 1,
		borderBottomStyle: "solid",
	},

	inputAdorn: {
		marginLeft: 5
	},

	messageContainer: {
		flexGrow: 1,
		flexShrink: 0
	},

	messageList: {
		flexGrow: 100,
		flexShrink: 0
	},

	messageEditorContainer: {
		flexGrow: 1,
		flexBasis: 60,
	},

	editorActions: {
		display: "flex",
		justifyContent: "flex-end",
		margin: 5
	},

	message: {
	},

	newMessageInput: {
		borderTopColor: grey[300],
		borderTopWidth: 1,
		borderTopStyle: "solid",
	}
});

interface IDMEditorProps {
	controller: IDMEditorController
}

@observer
class DMEditor extends React.Component<
	IDMEditorProps &
	InjectedIntlProps &
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
			classes,
		} = this.props;

		const convo = controller.convo;

		let topComponents;
		if(convo) {
			topComponents = (
				<React.Fragment>
					<Typography>
						{convo.title}
					</Typography>
				</React.Fragment>
			)
		} else {
			const toPlaceholder = simpleFormat(this, "info.dmReceiver");
			const titlePlaceholder = simpleFormat(this, "info.dmTitle");

			const topInputClasses = clsx(classes.input, classes.topInput);

			topComponents = (
				<React.Fragment>
					<InputBase value={controller.newConversationModel.receiver}
						classes={{
							inputAdornedStart: classes.inputAdorn
						}}
						startAdornment={
							<React.Fragment>
								<FormattedMessage id="info.to"/>
								<span>:</span>
							</React.Fragment>
						}
						placeholder={toPlaceholder}
						className={topInputClasses}
						onChange={(event) => controller.onNewConversationChange(
							"receiver",
							event.target.value
						)} />

					<InputBase value={controller.newConversationModel.title}
						classes={{
							inputAdornedStart: classes.inputAdorn
						}}
						startAdornment={
							<React.Fragment>
								<FormattedMessage id="things.title"/>
								<span>:</span>
							</React.Fragment>
						}
						placeholder={titlePlaceholder}
						className={topInputClasses}
						onChange={(event) => controller.onNewConversationChange(
							"title",
							event.target.value
						)}
						/>
				</React.Fragment>
			)
		}

		const newMesssageInputClasses = clsx(classes.input, classes.newMessageInput);
		const newMessagePlaceholder = simpleFormat(this, "info.typeMessage");

		return (
			<div className={classes.root}>
				{topComponents}

				<div className={classes.messageList}>
					{this.renderMessages()}
				</div>

				<div className={classes.messageEditorContainer}>
					<InputBase className={newMesssageInputClasses}
						multiline={true}
						value={controller.dmModel.message}
						onChange={(event) => controller.onDMChange("message", event.target.value)}
						placeholder={newMessagePlaceholder}
						fullWidth={true}/>

					<div className={classes.editorActions}>
						<Button variant="contained"
							size="small">

							<FormattedMessage id="actions.send"/>
						</Button>
					</div>
				</div>
			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(DMEditor));
