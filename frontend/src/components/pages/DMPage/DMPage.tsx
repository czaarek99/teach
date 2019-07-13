import React from 'react';
import AddIcon from '@material-ui/icons/Add';

import { Theme, createStyles, WithStyles, withStyles, Fab } from "@material-ui/core";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { IDMPageController } from "../../../interfaces/controllers/pages/IDMPageController";

const styles = (theme: Theme) => createStyles({

	fab: {
		position: "fixed",
		margin: 10,
		bottom: 0,
		right: 0
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
		return (
			<span></span>
		)
	}

	public render() : React.ReactNode {

		const {
			classes,
			controller,
			navbarController
		} = this.props;

		return (
			<NavbarTemplate controller={navbarController}>
				<div>
					{this.renderUsers()}
				</div>

				<div>

				</div>

				<Fab className={classes.fab}
					onClick={() => controller.onNewDM()}>

					<AddIcon />
				</Fab>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(DMPage));