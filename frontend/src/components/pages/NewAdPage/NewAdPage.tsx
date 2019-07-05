import React from 'react';
import InfoIcon from "@material-ui/icons/Info";
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate";
import clsx from "clsx";

import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { INewAdPageController } from "../../../interfaces/controllers/pages/INewAdPageController";
import { observer } from "mobx-react";
import { NavbarTemplate } from "../../templates";
import { CustomTextField, LoadingButton } from "../../molecules";
import { simpleFormat } from "../../../util/simpleFormat";
import { ImageUploader } from "../../organisms";

import {
	InjectedIntlProps,
	injectIntl,
	FormattedMessage
} from "react-intl";

import {
	AD_NAME_MAX_LENGTH,
	AD_NAME_MIN_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
	MAXIMUM_AD_PICTURE_SIZE,
	MAX_AD_PICTURE_COUNT
} from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Paper,
	Snackbar,
	Button
} from "@material-ui/core";

const MEDIUM_BREAKPOINT = "@media screen and (min-width: 400px)";
const LARGE_BREAKPOINT = "@media screen and (min-width: 560px)";
const X_LARGE_BREAKPOINT = "@media screen and (min-width: 950px)";
const XX_LARGE_BREAKPOINT = "@media screen and (min-width: 1400px)";

const styles = (theme: Theme) => createStyles({
	content: {
		display: "flex",
		justifyContent: "center",
	},

	paper: {
		padding: 10,

		width: 300,

		[MEDIUM_BREAKPOINT]: {
			width: 380
		},

		[LARGE_BREAKPOINT]: {
			width: 460
		},

		[X_LARGE_BREAKPOINT]: {
			width: 600
		},

		[XX_LARGE_BREAKPOINT]: {
			width: 800
		}
	},

	uploader: {
		height: 150,
		marginBottom: 10,

		[MEDIUM_BREAKPOINT]: {
			height: 190
		},

		[LARGE_BREAKPOINT]: {
			height: 230
		},

		[X_LARGE_BREAKPOINT]: {
			height: 300
		},

		[XX_LARGE_BREAKPOINT]: {
			height: 400
		}
	},

	field: {
		marginBottom: 10
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},

	slots: {
		marginBottom: 10,
		display: "flex",
		justifyContent: "space-evenly"
	},

	imageSlot: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "dotted",
		borderColor: theme.palette.grey[200],
		width: 50,
		height: 50,
		position: "relative",
		cursor: "pointer",

		[MEDIUM_BREAKPOINT]: {
			width: 60,
			height: 60,
		}
	},

	disabledSlot: {
		opacity: .5,
		cursor: "not-allowed"
	},

	slotOverlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundSize: "contain",
	}

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

	private renderImageSlots() : React.ReactNodeArray {

		const {
			classes,
			controller
		} = this.props;

		const slots : React.ReactNodeArray = [];

		for(let i = 0; i < MAX_AD_PICTURE_COUNT; i++) {

			const className = clsx(classes.imageSlot, {
				[classes.disabledSlot]: !controller.isImageSlotEnabled(i)
			});

			let style;
			const imageUrl = controller.getImageUrl(i);
			if(imageUrl) {
				style = {
					backgroundImage: `url(${imageUrl})`
				}
			}

			slots.push(
				<div className={className}
					key={i}
					onClick={() => controller.setImageIndex(i)}>

					<AddPhotoIcon fontSize="large"/>

					<div className={classes.slotOverlay}
						style={{ backgroundImage: controller.getImageUrl(i)}}/>
				</div>
			);
		}

		return slots;
	}

	private renderErrorSnackbar() : React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		if(controller.pageError) {
			return (
				<Snackbar open={true}
					key={controller.pageError}
					ContentProps={{
						"className": classes.errorSnackbarContent
					}}
					action={
						<Button onClick={() => controller.onCloseSnackbar()}>
							<FormattedMessage id="actions.ok"/>
						</Button>
					}
					message={
						<FormattedMessage id={controller.pageError}/>
					}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					onClose={() => controller.onCloseSnackbar()}/>
			);
		}
	}

	public render() : React.ReactNode {

		const {
			navbarController,
			controller,
			classes
		} = this.props;

		const adNameLabel = simpleFormat(this, "things.adName");
		const descriptionLabel = simpleFormat(this, "things.description");

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.content}>
					<Paper className={classes.paper}>
						<CustomTextField
							className={classes.field}
							value={controller.model.name}
							minLength={AD_NAME_MIN_LENGTH}
							maxLength={AD_NAME_MAX_LENGTH}
							label={adNameLabel}
							required={true}
							onChange={event => controller.onChange("name", event.target.value)}
							startAdornment={ <InfoIcon /> }
							errorModel={controller.errorModel}
							validationKey="name"
							errorTranslationValues={{
								value: adNameLabel,
								minLength: AD_NAME_MIN_LENGTH,
								maxLength: AD_NAME_MAX_LENGTH
							}}
						/>

						<ImageUploader className={classes.uploader}
							onDrop={controller.onDrop}
							imageUrl={controller.imageUrl}
							state={controller.loading ? "disabled" : "default"}
							maxSize={MAXIMUM_AD_PICTURE_SIZE}
							active={controller.isDraggingOver}
							onDragEnter={() => controller.onDragEnter()}
							onDragLeave={() => controller.onDragLeave()}/>

						<div className={classes.slots}>
							{this.renderImageSlots()}
						</div>

						<CustomTextField
							rows={10}
							className={classes.field}
							multiline={true}
							value={controller.model.description}
							minLength={AD_DESCRIPTION_MIN_LENGTH}
							maxLength={AD_DESCRIPTION_MAX_LENGTH}
							label={descriptionLabel}
							required={true}
							onChange={event => controller.onChange("description", event.target.value)}
							errorModel={controller.errorModel}
							validationKey="description"
							errorTranslationValues={{
								value: adNameLabel,
								minLength: AD_DESCRIPTION_MIN_LENGTH,
								maxLength: AD_DESCRIPTION_MAX_LENGTH
							}}
						/>

						<LoadingButton onClick={() => controller.onSave()}
							state={controller.saveButtonState}>
							<FormattedMessage id="actions.save"/>
						</LoadingButton>
					</Paper>
				</div>

				{this.renderErrorSnackbar()}
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(NewAdPage));