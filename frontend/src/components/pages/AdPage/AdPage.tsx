import React from 'react';

import { IAdPageController } from "../../../interfaces/controllers/pages/IAdPageController";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { getImageUrl } from "../../../util/imageAPI";

import {
	Card,
	CardMedia,
	Theme,
	createStyles,
	WithStyles,
	withStyles
} from "@material-ui/core";
import Skeleton from "react-loading-skeleton";

const styles = (theme: Theme) => createStyles({

	root: {

	},

	card: {
		maxWidth: 1000
	},

	image: {

	}

});

interface IAdPageProps {
	controller: IAdPageController
	navbarController: INavbarController
}

class AdPage extends React.Component<
	IAdPageProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			controller,
			navbarController,
			classes
		} = this.props;

		const model = controller.model;

		let imageComponent;

		if(model === null) {
			imageComponent = (
				<Skeleton />
			)
		} else {
			imageComponent = (
				<CardMedia component="img"
					image={getImageUrl(model.imageFileName)}/>
			)
		}

		return (
			<NavbarTemplate controller={navbarController}>
				<div>
					<Card className={classes.card}>
						{imageComponent}
					</Card>
				</div>
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(AdPage);