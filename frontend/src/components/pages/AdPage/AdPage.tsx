import React from 'react';
import Skeleton from "react-loading-skeleton";
import AdCarousel from "./internal/AdCarousel";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { IAdPageController } from "../../../interfaces/controllers/pages/IAdPageController";
import { NavbarTemplate } from "../../templates";
import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { getImageUrl } from "../../../util/imageAPI";
import { FormattedMessage, InjectedIntlProps, injectIntl } from "react-intl";
import { observer } from "mobx-react";

import {
	Card,
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Typography,
	Avatar,
	Snackbar,
	Button,
} from "@material-ui/core";

const SMALL_BREAKPOINT = "@media screen and (min-width: 400px)";
const MEDIUM_BREAKPOINT = "@media screen and (min-width: 1000px)";
const LARGE_BREAKPOINT = "@media screen and (min-width: 1400px)";

const MIN_DESCRIPTION_LINES = 3;

const styles = (theme: Theme) => createStyles({

	root: {
		margin: "0 auto",
	},

	card: {
		padding: 10,
		width: 300,

		[SMALL_BREAKPOINT]: {
			width: 380
		},

		[MEDIUM_BREAKPOINT]: {
			width: 500
		},

		[LARGE_BREAKPOINT]: {
			width: 700
		}
	},

	image: {
		objectFit: "contain",
		height: 150,

		[SMALL_BREAKPOINT]: {
			height: 190
		},

		[MEDIUM_BREAKPOINT]: {
			height: 250
		},

		[LARGE_BREAKPOINT]: {
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
		borderBottomColor: theme.palette.grey[200],
		borderBottomStyle: "solid",
		borderBottomWidth: 2
	},

	ownerControlContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: 10,
		flexGrow: 1,
		flexBasis: 0,
		cursor: "pointer",

		"&:hover": {
			backgroundColor: theme.palette.grey[100]
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
				<AdCarousel controller={controller}/>
			);

			if(model.teacher.avatarFileName) {
				avatarComponent = (
					<Avatar src={getImageUrl(model.teacher.avatarFileName)}/>
				)
			} else {
				avatarComponent = (
					<Avatar>
						{model.teacher.firstName[0]}
					</Avatar>
				)
			}

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

			descriptionComponent = model.description;
			titleComponent = model.name;
			realNameComponent = `${model.teacher.firstName} ${model.teacher.lastName}`;
			cityComponent = model.teacher.city;
		}

		let snackbar;
		if(controller.errorMessage) {
			snackbar = (
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
			)
		}

		let ownerControls;
		if(controller.isMyAd) {
			ownerControls = (
				<section className={classes.ownerControls}>
					<div className={classes.ownerControlContainer}
						onClick={() => controller.edit()}>

						<EditIcon />
					</div>
					<div className={classes.ownerControlContainer}
						onClick={() => controller.delete()}>

						<DeleteIcon />
					</div>
				</section>
			);
		}

		return (
			<NavbarTemplate controller={navbarController}>
				{snackbar}

				<div className={classes.root}>
					<Card className={classes.card}>
						{ownerControls}

						<section className={classes.section}>
							<Typography variant="h4">
								<FormattedMessage id="things.ad"/>
							</Typography>
						</section>

						<section className={classes.section}>
							<Typography variant="h5" noWrap={true}>
								{titleComponent}
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
			</NavbarTemplate>
		)
	}

}

export default withStyles(styles)(injectIntl(AdPage));