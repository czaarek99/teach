import React from "react";
import DMEditor from "./DMEditor";
import DMInput from "./DMInput";

import { observer } from "mobx-react";
import { FormattedMessage, injectIntl, InjectedIntlProps } from "react-intl";
import { grey } from "@material-ui/core/colors";
import { simpleFormat } from "../../../../util";
import { CustomAvatar } from "../../../molecules";
import { INewConversationCreatorController } from "../../../../interfaces";
import { ErrorSnackbar } from "../../../organisms";

import {
	Theme,
	createStyles,
	WithStyles,
	Typography,
	withStyles,
	Button,
	Paper,
	ClickAwayListener
} from "@material-ui/core";

import {
	CONVERSATION_TITLE_MAX_LENGTH,
	ITeacher,
	CONVERSATION_TITLE_MIN_LENGTH
} from "common-library";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},

	topInput: {
		borderBottomColor: grey[300],
		borderBottomWidth: 1,
		borderBottomStyle: "solid",
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

		const toLabel = simpleFormat(this, "info.to");
		const toPlaceholder = simpleFormat(this, "info.dmReceiver");

		return (
			<ClickAwayListener onClickAway={() => controller.onClickOutsideSearch()}>
				<div className={classes.searchContainer}>
					<DMInput value={controller.model.receiver}
						errorModel={controller.errorModel}
						validationKey="receiver"
						onClick={() => controller.onSearchInputClick()}
						type="search"
						label={toLabel}
						placeholder={toPlaceholder}
						className={classes.topInput}
						onChange={(value) => controller.onChange(
							"receiver",
							value
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

		const titleLabel = simpleFormat(this, "things.title");
		const titlePlaceholder = simpleFormat(this, "info.dmTitle");

		return (
			<React.Fragment>
				{this.renderUserSearchInput()}

				<DMInput value={controller.model.title}
					inputProps={{
						maxLength: CONVERSATION_TITLE_MAX_LENGTH,
						minLength: CONVERSATION_TITLE_MIN_LENGTH
					}}
					errorTranslationValues={{
						value: titleLabel,
						minLength: CONVERSATION_TITLE_MIN_LENGTH,
						maxLength: CONVERSATION_TITLE_MAX_LENGTH
					}}
					errorModel={controller.errorModel}
					validationKey="title"
					label={titleLabel}
					placeholder={titlePlaceholder}
					className={classes.topInput}
					onChange={(value) => controller.onChange(
						"title",
						value
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
