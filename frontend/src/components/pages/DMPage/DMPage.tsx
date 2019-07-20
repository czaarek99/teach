import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Conversation from "./internal/Conversation";
import NewConversationCreator from "./internal/NewConversationCreator";
import DM from "./internal/DM";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController, IDMPageController } from "../../../interfaces";
import { IConversation } from "common-library";
import { grey } from "@material-ui/core/colors";
import { ErrorSnackbar } from "../../organisms";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Fab,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	content: {
		display: "flex",
		position: "relative"
	},

	messages: {
		flexBasis: 50,
		flexGrow: 0,
		flexShrink: 0,
		borderRightWidth: 1,
		borderRightColor: grey[300],
		borderRightStyle: "solid",

		"@media screen and (min-width: 500px)": {
			flexBasis: 100,
		},

		"@media screen and (min-width: 1000px)": {
			flexBasis: 270,
		}
	},

	editor: {
		flexGrow: 1,
		flexShrink: 1
	},

	fab: {
		position: "absolute",
		margin: 10,
		bottom: 0,
		left: 0
	},

});

interface IDMPageProps {
	navbarController: INavbarController
	controller: IDMPageController
}

@observer
class DMPage extends React.Component<
	IDMPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	private renderSnackbar() : React.ReactNode {

		const {
			controller
		} = this.props;

		if(controller.errorMessage) {
			return (
				<ErrorSnackbar errorMessage={controller.errorMessage}
					onClose={() => controller.onCloseSnackbar()}
					action={
						<Button onClick={() => controller.onCloseSnackbar()}>
							<FormattedMessage id="actions.ok"/>
						</Button>
					}
				/>
			);
		}
	}

	private renderUsers() : React.ReactNode {

		const {
			controller
		} = this.props;

		const convos = controller.convos.map((convo: IConversation) => {
			return (
				<DM convo={convo}
					key={convo.id}
					controller={controller} />
			);
		});

		return (
			<div>
				{convos}
			</div>
		)
	}

	public render() : React.ReactNode {

		const {
			classes,
			controller,
			navbarController
		} = this.props;

		let content;

		if(controller.newConvoController) {
			content = (
				<NewConversationCreator controller={controller.newConvoController}/>
			);
		} else if(controller.oldConvoController){
			content = (
				<Conversation controller={controller.oldConvoController}/>
			);
		}

		return (
			<NavbarTemplate controller={navbarController}
				padding={false}>

				<div className={classes.content}>
					<div className={classes.messages}>
						{this.renderUsers()}
					</div>

					<div className={classes.editor}>
						{content}
					</div>

					<Fab className={classes.fab}
						size="medium"
						onClick={() => controller.onNewDM()}>

						<AddIcon />
					</Fab>
				</div>

				{this.renderSnackbar()}
			</NavbarTemplate>
		);
	}

}

export default withStyles(styles)(injectIntl(DMPage));