import React from 'react';

import { Theme, createStyles, Typography } from "@material-ui/core";
import { IEditAdPageController } from "../../../../interfaces/controllers/pages/INewAdPageController";
import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { WithStyles, withStyles } from "@material-ui/styles";
import { MAX_AD_PICTURE_COUNT, MAXIMUM_AD_PICTURE_SIZE } from "common-library";
import { ImageUploader } from "../../../organisms";

import {
	MEDIUM_BREAKPOINT,
	UPLOADER_BORDER,
	LARGE_BREAKPOINT,
	XX_LARGE_BREAKPOINT,
	X_LARGE_BREAKPOINT
} from "../EditAdPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

const styles = (theme: Theme) => createStyles({
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

	slots: {
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
		},

		"&:hover $removeOverlay": {
			opacity: 1
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
		opacity: 0,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: `${theme.palette.grey[200]}aa`,
		transition: "opacity 500ms",
		width: 25,
		height: 25,
		bottom: 0,
		right: 0,
		cursor: ""
	},

	numberOverlay: {
		position: "absolute",
		bottom: 0,
		left: 0,
		height: 25,
		width: 25,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: `${theme.palette.grey[200]}aa`,
	},

	imageUploaderError: {
		color: theme.palette.error.main,
		fontSize: ".75rem",
		margin: "8px 12px 0"
	}
});

interface IAdImageUploaderProps {
	controller: IEditAdPageController
}

@observer
class AdImageUploader extends React.Component<
	IAdImageUploaderProps &
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

							<FontAwesomeIcon icon={faTrash}/>
						</div>
					</React.Fragment>
				);

			}

			slots.push(
				<div className={classes.imageSlot}
					key={i}
					onClick={() => controller.setImageIndex(i)}>

					<FontAwesomeIcon icon={faCloudUploadAlt} />

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

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		let uploaderErrorText;

		const error = controller.errorModel.getFirstKeyError("images");
		if(error) {
			uploaderErrorText = (
				<FormattedMessage id={error}/>
			);
		}

		return (
			<div>
				<ImageUploader className={classes.uploader}
					onDrop={controller.onDrop}
					imageUrl={controller.currentImageUrl}
					state={controller.loading ? "disabled" : "default"}
					maxSize={MAXIMUM_AD_PICTURE_SIZE}
					multiple={true}
					active={controller.isDraggingOver}
					showOverlay={!controller.currentImageUrl}
					onDragEnter={() => controller.onDragEnter()}
					onDragLeave={() => controller.onDragLeave()}/>

				<div className={classes.slots}>
					{this.renderImageSlots()}
				</div>

				<Typography className={classes.imageUploaderError}>
					{uploaderErrorText}
				</Typography>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(AdImageUploader));