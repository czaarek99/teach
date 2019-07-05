import React from 'react';

import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { INewAdPageController } from "../../../interfaces/controllers/pages/INewAdPageController";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import { NavbarTemplate } from "../../templates";

const styles = (theme: Theme) => createStyles({

});

interface INewAdPageProps {
	navbarController: INavbarController
	controller: INewAdPageController
}

@observer
class NewAdPage extends React.Component<
	INewAdPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			navbarController,
			controller
		} = this.props;

		return (
			<NavbarTemplate controller={navbarController}>

			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(NewAdPage));