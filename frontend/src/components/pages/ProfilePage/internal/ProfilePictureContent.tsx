import React from 'react';
import Dropzone from "react-dropzone";
import UploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import clsx from "clsx";

import { observer } from "mobx-react";
import { IProfilePictureController } from "../../../../interfaces/controllers/profile/IProfilePictureController";
import { LoadingButton } from "../../../molecules";
import { MAXIMUM_PROFILE_PICTURE_SIZE } from "common-library";

import {
	WithStyles,
	Theme,
	createStyles,
	Paper,
	withStyles,
	Typography,
} from "@material-ui/core";

import {
	InjectedIntlProps,
	injectIntl,
	FormattedMessage
} from "react-intl";

interface IProfilePictureContentProps {
	controller: IProfilePictureController
}

const styles = (theme: Theme) => createStyles({
	normalPaper: {
		marginTop: 10,
		padding: 10
	},

	dropzone: {
		width: 256,
		height: 256,
		borderWidth: 2,
		borderColor: theme.palette.primary.main,
		borderStyle: "solid",
		borderRadius: 3,
		cursor: "pointer",
		outline: "none",
		backgroundSize: "contain",
		position: "relative",

	},

	saveButton: {
		marginRight: 10
	},

	buttonsContainer: {
		marginTop: 10
	},

	overlay: {
		position: "absolute",
		top: 0,
		opacity: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: `${theme.palette.grey[300]}aa`,
		transition: "opacity 500ms",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",

		"&:hover": {
			opacity: 1
		}
	},

	activeOverlay: {
		opacity: "1 !important" as any,
	}
});

@observer
class ProfilePictureContent extends React.Component<
	IProfilePictureContentProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public componentWillUnmount() : void {
		this.props.controller.onUnmount();
	}

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		const isDisabled = controller.loading;

		const overlayClasses = clsx(classes.overlay, {
			[classes.activeOverlay]: controller.isDraggingOver
		});

		let dropzoneStyle : React.CSSProperties;
		if(controller.imageUrl) {
			dropzoneStyle = {
				backgroundImage: `url(${controller.imageUrl})`
			};
		}

		let deleteButton;
		if(controller.showDelete) {
			deleteButton = (
				<LoadingButton state={controller.deleteButtonState}
					onClick={() => controller.onDelete()}>
						<FormattedMessage id="actions.delete"/>
				</LoadingButton>
			);
		}

		return (
			<Paper className={classes.normalPaper}>
				<Typography variant="h5">
					<FormattedMessage id="things.profilePicture"/>
				</Typography>

				<Typography>
					<FormattedMessage id="info.profilePicDrop"  />
				</Typography>

				<Dropzone onDrop={controller.onDrop}
					onDragEnter={() => controller.onDragEnter()}
					onDragLeave={() => controller.onDragLeave()}
					accept="image/*"
					maxSize={MAXIMUM_PROFILE_PICTURE_SIZE}
					multiple={false}
					noKeyboard={true}
					disabled={isDisabled}>

					{(props) => (
						<div {...props.getRootProps()}
							style={dropzoneStyle}
							className={classes.dropzone}>

							<input {...props.getInputProps()}/>

							<div className={overlayClasses}>
								{controller.imageUrl ?
									<EditIcon fontSize="large"/> :
									<UploadIcon fontSize="large" />
								}
							</div>
						</div>
					)}
				</Dropzone>

				<div className={classes.buttonsContainer}>
					<LoadingButton className={classes.saveButton}
						state={controller.saveButtonState}
						onClick={() => controller.onSave()}>
							<FormattedMessage id="actions.save" />
					</LoadingButton>

					{deleteButton}
				</div>
			</Paper>
		)
	}

}

export default withStyles(styles)(injectIntl(ProfilePictureContent));