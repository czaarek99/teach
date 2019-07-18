import React from "react";
import clsx from "clsx";
import DMEditor from "./DMEditor";

import { observer } from "mobx-react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { grey } from "@material-ui/core/colors";
import { simpleFormat } from "../../../../util";
import { CustomAvatar } from "../../../molecules";
import { INewConversationCreatorController } from "../../../../interfaces";

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

import {
	CONVERSATION_TITLE_MAX_LENGTH,
	ITeacher
} from "common-library";
import { ErrorSnackbar } from "../../../organisms";

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

	message: {
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

interface INewConversationCreatorProps {
	controller: INewConversationCreatorController
}

@observer
class NewConversationCreator extends React.Component<
	INewConversationCreatorProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	private renderSnackbar() : React.ReactNode {

		const {
			controller
		} = this.props;

		return (
			<ErrorSnackbar errorMessage={controller.errorMessage}
				onClose={() => controller.onCloseSnackbar()}
				action={
					<Button onClick={() => controller.onRetryStartConversation()}>
						<FormattedMessage id="actions.tryAgain"/>
					</Button>
				}
			/>
		);
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
					<InputBase value={controller.model.receiver}
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
						onChange={(event) => controller.onChange(
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

		const titlePlaceholder = simpleFormat(this, "info.dmTitle");
			const topInputClasses = clsx(classes.input, classes.topInput);

			return (
				<React.Fragment>
					{this.renderUserSearchInput()}

					<InputBase value={controller.model.title}
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
						onChange={(event) => controller.onChange(
							"title",
							event.target.value
						)}
					/>
			</React.Fragment>
		);
	}

	public render() : React.ReactNode {

		const {
			controller,
			classes,
		} = this.props;

		return (
			<div className={classes.root}>
				{this.renderHeader()}

				<div className={classes.messageList}>
				</div>

				<DMEditor value={controller.model.message}
					onSend={() => controller.onStartConversation()}
					onChange={value => controller.onChange("message", value)}/>

				{this.renderSnackbar()}
			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(NewConversationCreator));
