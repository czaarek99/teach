import React from 'react';
import Skeleton from "react-loading-skeleton";
import AdCarousel from "./internal/AdCarousel";

import { IAdPageController, INavbarController } from "../../../interfaces";
import { CustomAvatar } from "../../molecules";
import { NavbarTemplate } from "../../templates";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { observer } from "mobx-react";
import { red } from "@material-ui/core/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import {
	Card,
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
	Snackbar,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@material-ui/core";

const AD_SMALL_BREAKPOINT = "@media screen and (min-width: 400px)";
const AD_MEDIUM_BREAKPOINT = "@media screen and (min-width: 1000px)";
const AD_LARGE_BREAKPOINT = "@media screen and (min-width: 1400px)";

const MIN_DESCRIPTION_LINES = 3;

const styles = (theme: Theme) => createStyles({

	root: {
		margin: "0 auto",
	},

	card: {
		padding: 10,
		width: 300,

		[AD_SMALL_BREAKPOINT]: {
			width: 380
		},

		[AD_MEDIUM_BREAKPOINT]: {
			width: 500
		},

		[AD_LARGE_BREAKPOINT]: {
			width: 700
		}
	},

	image: {
		objectFit: "contain",
		height: 150,

		[AD_SMALL_BREAKPOINT]: {
			height: 190
		},

		[AD_MEDIUM_BREAKPOINT]: {
			height: 250
		},

		[AD_LARGE_BREAKPOINT]: {
			height: 350
		}
	},

	teacherDetails: {
		marginTop: 5
	},

	nameAndAvatar: {
		display: "flex",
		alignItems: "center"
	},

	teacherName: {
		fontSize: 17,
		marginLeft: 16,
		flexGrow: 1
	},

	boldText: {
		fontWeight: "bold"
	},

	section: {
		marginBottom: 15
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},

	description: {},

	ownerControls: {
		display: "flex",
	},

	ownerControlButton: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		flexGrow: 1,
		flexBasis: 0,
		cursor: "pointer",
		transition: "background-color 300ms",

		"&:hover": {
			backgroundColor: theme.palette.grey[100]
		}
	},

	deleteButton: {
		backgroundColor: red[600],

		"&:hover": {
			backgroundColor: red[800]
		}
	}

});

interface IAdPageProps {
	controller: IAdPageController
	navbarController: INavbarController
}

@observer
class AdPage extends React.Component<
	IAdPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	private renderSnackbar() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		if(controller.errorMessage) {
			return (
				<Snackbar open={true}
					key={controller.errorMessage}
					ContentProps={{
						"className": classes.errorSnackbarContent
					}}
					action={
						<Button onClick={() => controller.goBackToBrowse()}>
							<FormattedMessage id="actions.goBackToBrowse"/>
						</Button>
					}
					message={
						<FormattedMessage id={controller.errorMessage}/>
					}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					onClose={() => controller.closeSnackbar()}/>
			);
		}
	}

	private renderOwnerControls() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		if(controller.isMyAd) {
			return (
				<section className={classes.ownerControls}>
					<Button className={classes.ownerControlButton}
						onClick={() => controller.edit()}>

						<FontAwesomeIcon icon={faPen}/>
					</Button>
					<Button className={classes.ownerControlButton}
						onClick={() => controller.openConfirmDialog()}>

						<FontAwesomeIcon icon={faTrash}/>
					</Button>
				</section>
			);
		}
	}

	private renderConfirmationModal() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		return (
			<Dialog open={controller.showConfirmDeleteDialog}
				keepMounted={true}
				onClose={() => controller.closeConfirmDialog()}>

				<DialogTitle>
					<FormattedMessage id="info.areYouSure"/>
				</DialogTitle>

				<DialogContent>
					<FormattedMessage id="info.adDelete"/>
				</DialogContent>

				<DialogActions>
					<Button onClick={() => controller.closeConfirmDialog()}>
						<FormattedMessage id="actions.cancel"/>
					</Button>
					<Button onClick={() => controller.delete()}
						className={classes.deleteButton}
						variant="contained">

						<FormattedMessage id="actions.delete"/>
					</Button>
				</DialogActions>
			</Dialog>
		);
	}

	public render() : React.ReactNode {

		const {
			controller,
			navbarController,
			classes
		} = this.props;

		const model = controller.ad;

		let titleComponent: React.ReactNode = <Skeleton />;
		let realNameComponent: React.ReactNode = <Skeleton />;
		let emailComponent: React.ReactNode = <Skeleton/> ;
		let phoneComponent: React.ReactNode = <Skeleton />;
		let cityComponent: React.ReactNode = <Skeleton />;
		let categoryComponent: React.ReactNode = <Skeleton />;

		let avatarComponent;
		let imageComponent;
		let descriptionComponent;

		if(model === null) {
			imageComponent = (
				<div className={classes.image}>
					<Skeleton height="100%"/>
				</div>
			);

			avatarComponent = (
				<Skeleton width={40}
					height={40}
					circle={true}/>
			);

			descriptionComponent = (
				<Skeleton count={MIN_DESCRIPTION_LINES}/>
			);

		} else {
			imageComponent = (
				<AdCarousel controller={controller}
					imageClassName={classes.image}/>
			);

			avatarComponent = (
				<CustomAvatar alt={model.teacher.firstName[0]}
					imageUrl={model.teacher.avatarFileName}/>
			);

			if(model.teacher.phoneNumber) {
				phoneComponent = model.teacher.phoneNumber;
			} else {
				phoneComponent = (
					<FormattedMessage id="things.hidden"/>
				);
			}

			if(model.teacher.email) {
				emailComponent = model.teacher.email;
			} else {
				emailComponent = (
					<FormattedMessage id="things.hidden"/>
				);
			}

			categoryComponent = (
				<React.Fragment>
					<FormattedMessage id="things.adCategory"/>
					<span>: </span>
					<FormattedMessage id={model.category}/>
				</React.Fragment>
			);

			titleComponent = (
				<React.Fragment>
					<FormattedMessage id="things.title"/>
					<span>: </span>
					{model.name}
				</React.Fragment>
			);

			descriptionComponent = model.description;
			realNameComponent = `${model.teacher.firstName} ${model.teacher.lastName}`;
			cityComponent = model.teacher.city;
		}

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.root}>
					<Card className={classes.card}>
						{this.renderOwnerControls()}

						<section className={classes.section}>
							<Typography variant="h4">
								<FormattedMessage id="things.ad"/>
							</Typography>
						</section>

						<section className={classes.section}>
							<Typography variant="h5"
								noWrap={true}>
								{titleComponent}
							</Typography>

							<Typography variant="h6"
								noWrap={true}>
								{categoryComponent}
							</Typography>

							{imageComponent}
						</section>


						<section className={classes.section}>
							<Typography variant="h6">
								<FormattedMessage id="things.teacher"/>
							</Typography>

							<div className={classes.nameAndAvatar}>
								{avatarComponent}
								<Typography className={classes.teacherName}>
									{realNameComponent}
								</Typography>
							</div>

							<Typography noWrap={true}>
								<span className={classes.boldText}>
									<FormattedMessage id="things.city"/>
								</span>
								<span>: </span>
								{cityComponent}
							</Typography>
							<Typography noWrap={true}>
								<span className={classes.boldText}>
									<FormattedMessage id="things.email"/>
								</span>
								<span>: </span>

								{emailComponent}
							</Typography>
							<Typography noWrap={true}>
								<span className={classes.boldText}>
									<FormattedMessage id="things.phoneNumber"/>
								</span>
								<span>: </span>

								{phoneComponent}
							</Typography>
						</section>

						<section className={classes.section}>
							<Typography variant="h6">
								<FormattedMessage id="things.description"/>
							</Typography>

							<Typography className={classes.description}>
								{descriptionComponent}
							</Typography>
						</section>
					</Card>
				</div>

				{this.renderSnackbar()}
				{this.renderConfirmationModal()}
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(AdPage));