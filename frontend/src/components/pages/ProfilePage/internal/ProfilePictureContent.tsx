import React from 'react';
import Dropzone from "react-dropzone";
import UploadIcon from "@material-ui/icons/CloudUpload";
import DropIcon from "@material-ui/icons/VerticalAlignBottom";
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
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: theme.palette.primary.main,
		borderStyle: "solid",
		borderRadius: 3,
		cursor: "pointer",
		outline: "none",
		transition: "background-color 400ms",
		backgroundSize: "contain",

		"&:hover": {
			backgroundColor: theme.palette.grey[100]
		},

		"&:active": {
			backgroundColor: theme.palette.grey[200],
		}
	},

	activeDropzone: {
		backgroundColor: theme.palette.grey[300]
	},

	saveButton: {
		marginTop: 10
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

		let uploadIcon;
		if(!controller.imageUrl) {

			if(controller.isDraggingOver) {
				uploadIcon = <DropIcon fontSize="large" />
			} else {
				uploadIcon = <UploadIcon fontSize="large" />;
			}
		}


		const dropzoneClasses = clsx(classes.dropzone, {
			[classes.activeDropzone]: controller.isDraggingOver
		});

		let dropzoneStyle : React.CSSProperties;
		if(controller.imageUrl) {
			dropzoneStyle = {
				backgroundImage: `url(${controller.imageUrl})`
			};
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
							className={dropzoneClasses}>

							<input {...props.getInputProps()}/>
							{uploadIcon}
						</div>
					)}
				</Dropzone>

				<LoadingButton className={classes.saveButton}
					state={controller.saveButtonState}
					onClick={() => controller.onSave()}>
						<FormattedMessage id="actions.save" />
				</LoadingButton>
			</Paper>
		)
	}

}

export default withStyles(styles)(injectIntl(ProfilePictureContent));