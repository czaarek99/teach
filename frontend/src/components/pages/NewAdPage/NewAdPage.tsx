import React from 'react';
import InfoIcon from "@material-ui/icons/Info";
import AddPhotoIcon from "@material-ui/icons/AddPhotoAlternate";
import DeleteIcon from "@material-ui/icons/Delete";

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
	Button,
	Typography
} from "@material-ui/core";

const MEDIUM_BREAKPOINT = "@media screen and (min-width: 400px)";
const LARGE_BREAKPOINT = "@media screen and (min-width: 560px)";
const X_LARGE_BREAKPOINT = "@media screen and (min-width: 980px)";
const XX_LARGE_BREAKPOINT = "@media screen and (min-width: 1400px)";

const PAPER_PADDING = 10;
const UPLOADER_BORDER = 2;

const styles = (theme: Theme) => createStyles({
	content: {
		display: "flex",
		justifyContent: "center",
	},

	paper: {
		padding: PAPER_PADDING,

		width: 300,

		[MEDIUM_BREAKPOINT]: {
			width: 380 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[LARGE_BREAKPOINT]: {
			width: 430 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[X_LARGE_BREAKPOINT]: {
			width: 600 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[XX_LARGE_BREAKPOINT]: {
			width: 800 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		}
	},

	uploader: {
		height: 150,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,

		[MEDIUM_BREAKPOINT]: {
			height: 190 + UPLOADER_BORDER * 2
		},

		[LARGE_BREAKPOINT]: {
			height: 215 + UPLOADER_BORDER * 2
		},

		[X_LARGE_BREAKPOINT]: {
			height: 300 + UPLOADER_BORDER * 2
		},

		[XX_LARGE_BREAKPOINT]: {
			height: 400 + UPLOADER_BORDER * 2
		}
	},

	field: {
		marginBottom: 10
	},

	description: {
		marginBottom: 10,
		marginTop: 10
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},

	slots: {
		marginBottom: 3,
		display: "flex",
		justifyContent: "center"
	},

	imageSlot: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderStyle: "solid",
		borderColor: theme.palette.primary.main,
		borderWidth: "0 0 2px 2px",
		width: 120,
		height: 60,
		position: "relative",
		cursor: "pointer",

		"&:first-child": {
			borderBottomLeftRadius: 3,
		},

		"&:last-child": {
			borderRightWidth: 2,
			borderBottomRightRadius: 2
		},

		[MEDIUM_BREAKPOINT]: {
			width: 140,
			height: 70,
		},

		[XX_LARGE_BREAKPOINT]: {
			width: 200,
			height: 100
		}
	},

	disabledSlot: {
		opacity: .5,
		cursor: "not-allowed"
	},

	imageOverlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		backgroundSize: "contain",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	removeOverlay: {
		position: "absolute",
		width: "100%",
		height: "100%",
		opacity: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: `${theme.palette.grey[200]}aa`,
		transition: "opacity 500ms",

		"&:hover": {
			opacity: 1
		}
	},

	numberOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		height: 20,
		width: 20,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: `${theme.palette.grey[200]}aa`,
	},

	imageUploaderError: {
		color: theme.palette.error.main
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

	public componentDidMount() : void {
		const onWindowResize = this.props.controller.onWindowResize;
		window.addEventListener("resize", onWindowResize);
		onWindowResize();
	}

	public componentWillUnmount() : void {
		window.removeEventListener("resize", this.props.controller.onWindowResize);
	}

	private renderImageSlots() : React.ReactNodeArray {

		const {
			classes,
			controller
		} = this.props;

		const slots : React.ReactNodeArray = [];

		for(let i = 0; i < MAX_AD_PICTURE_COUNT; i++) {

			let overlays;
			const imageUrl = controller.getImageUrl(i);

			if(imageUrl) {
				const style = {
					backgroundImage: `url(${imageUrl})`
				};

				overlays = (
					<React.Fragment>
						<div className={classes.imageOverlay}
							style={style}/>

						<div className={classes.removeOverlay}
							onClick={() => controller.onDeleteImage(i)}>

							<DeleteIcon fontSize="large"/>
						</div>
					</React.Fragment>
				);

			}

			slots.push(
				<div className={classes.imageSlot}
					key={i}
					onClick={() => controller.setImageIndex(i)}>

					<AddPhotoIcon fontSize="large"/>

					{overlays}

					<div className={classes.numberOverlay}>
						<Typography>
							{i+1}
						</Typography>
					</div>
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
			classes,
		} = this.props;

		const adNameLabel = simpleFormat(this, "things.adName");
		const descriptionLabel = simpleFormat(this, "things.description");

		let uploaderErrorText;

		const error = controller.errorModel.getFirstKeyError("images");
		if(error) {
			uploaderErrorText = (
				<FormattedMessage id={error}/>
			);
		}

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
							multiple={true}
							active={controller.isDraggingOver}
							showOverlay={!controller.imageUrl}
							onDragEnter={() => controller.onDragEnter()}
							onDragLeave={() => controller.onDragLeave()}/>

						<div className={classes.slots}>
							{this.renderImageSlots()}
						</div>

						<Typography className={classes.imageUploaderError}>
							{uploaderErrorText}
						</Typography>

						<CustomTextField
							rows={controller.descriptionRows}
							className={classes.description}
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