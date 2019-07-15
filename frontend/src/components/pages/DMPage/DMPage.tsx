import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import DM from "./internal/DM";
import DMEditor from "./internal/DMEditor";

import { Theme, createStyles, WithStyles, withStyles, Fab } from "@material-ui/core";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { IDMPageController } from "../../../interfaces/controllers/pages/IDMPageController";
import { IConversation } from "common-library";
import { grey } from "@material-ui/core/colors";

const styles = (theme: Theme) => createStyles({

	content: {
		display: "flex",
		position: "relative"
	},

	messages: {
		flexBasis: 270,
		flexGrow: 0,
		flexShrink: 0,
		borderRightWidth: 1,
		borderRightColor: grey[300],
		borderRightStyle: "solid"
	},

	editor: {
		flexGrow: 1,
		flexShrink: 0
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

	private renderUsers() : React.ReactNode {

		const {
			controller
		} = this.props;

		const convos = controller.convos.map((convo: IConversation) => {
			return (
				<DM convo={convo} controller={controller} />
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

		return (
			<NavbarTemplate controller={navbarController}
				padding={false}>

				<div className={classes.content}>
					<div className={classes.messages}>
						{this.renderUsers()}


					</div>

					<div className={classes.editor}>
						<DMEditor controller={controller.editorController}/>

					</div>

					<Fab className={classes.fab}
						size="medium"
						onClick={() => controller.onNewDM()}>

						<AddIcon />
					</Fab>
				</div>
			</NavbarTemplate>
		);
	}

}

export default withStyles(styles)(injectIntl(DMPage));