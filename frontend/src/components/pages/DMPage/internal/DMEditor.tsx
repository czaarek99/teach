import React from "react";
import clsx from "clsx";

import { observer } from "mobx-react";
import { IDMEditorController } from "../../../../interfaces/controllers/IDMEditorController";
import { IMessage, DM_MAX_LENGTH, CONVERSATION_TITLE_MAX_LENGTH, ITeacher } from "common-library";
import { FormattedDate, FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { grey } from "@material-ui/core/colors";
import { simpleFormat } from "../../../../util/simpleFormat";
import { CustomAvatar } from "../../../molecules";

import {
	Theme,
	createStyles,
	WithStyles,
	InputBase,
	Typography,
	withStyles,
	Button,
	Paper,
	ClickAwayListener
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
	},

	searchContainer: {
		position: "relative"
	},

	dropdown: {
		position: "absolute",
		padding: 10,
		left: 0,
		right: 0,
		zIndex: 10,
		maxHeight: 500,
		overflowY: "scroll"
	},

	user: {
		display: "flex",
		alignItems: "center",
		textTransform: "none",
		marginBottom: 5
	},

	avatar: {
		margin: 5
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

	private renderMessages() : React.ReactNode {

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

	private renderUserSearchInput() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		const topInputClasses = clsx(classes.input, classes.topInput);
		const toPlaceholder = simpleFormat(this, "info.dmReceiver");

		let dropdown;

		if(controller.showUserDropdown) {
			let dropdownContent;

			const result = controller.userSearchResult;
			if(result.length > 0) {
				dropdownContent = result.map((teacher: ITeacher) => {
					return (
						<Button className={classes.user}
							key={teacher.id}
							onClick={() => controller.onSelectUserToMessage(teacher)}
							fullWidth={true}>

							<CustomAvatar imageUrl={teacher.avatarFileName}
								className={classes.avatar}
								alt={teacher.firstName[0]}/>
							<Typography>
								{teacher.firstName} {teacher.lastName}
							</Typography>
						</Button>
					)
				})
			} else if(controller.dropdownMessage){
				dropdownContent = (
					<Typography>
						<FormattedMessage id={controller.dropdownMessage}/>
					</Typography>
				);
			}

			dropdown = (
				<Paper className={classes.dropdown}>
					{dropdownContent}
				</Paper>
			);
		}

		return (
			<ClickAwayListener onClickAway={() => controller.onClickOutsideSearch()}>
				<div className={classes.searchContainer}>
					<InputBase value={controller.newConversationModel.receiver}
						fullWidth={true}
						onClick={() => controller.onSearchInputClick()}
						type="search"
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

					{dropdown}
				</div>
			</ClickAwayListener>
		);
	}

	private renderHeader() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		const convo = controller.convo;

		if(convo) {
			return (
				<React.Fragment>
					<Typography>
						{convo.title}
					</Typography>
				</React.Fragment>
			);
		} else {
			const titlePlaceholder = simpleFormat(this, "info.dmTitle");
			const topInputClasses = clsx(classes.input, classes.topInput);

			return (
				<React.Fragment>
					{this.renderUserSearchInput()}

					<InputBase value={controller.newConversationModel.title}
						inputProps={{
							maxLength: CONVERSATION_TITLE_MAX_LENGTH
						}}
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
			);
		}
	}

	public render() : React.ReactNode {

		const {
			controller,
			classes,
		} = this.props;


		const newMesssageInputClasses = clsx(classes.input, classes.newMessageInput);
		const newMessagePlaceholder = simpleFormat(this, "info.typeMessage");

		return (
			<div className={classes.root}>
				{this.renderHeader()}

				<div className={classes.messageList}>
					{this.renderMessages()}
				</div>

				<div className={classes.messageEditorContainer}>
					<InputBase className={newMesssageInputClasses}
						inputProps={{
							maxLength: DM_MAX_LENGTH
						}}
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
