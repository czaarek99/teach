import React from 'react';

import { observer } from "mobx-react";
import { IProfilePictureController } from "../../../../interfaces/controllers/profile/IProfilePictureController";
import { LoadingButton } from "../../../molecules";
import { MAXIMUM_PROFILE_PICTURE_SIZE } from "common-library";
import { ImageUploader } from "../../../organisms";

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

	saveButton: {
		marginRight: 10
	},

	buttonsContainer: {
		marginTop: 10
	},

	uploader: {
		width: 256,
		height: 256
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

				<ImageUploader maxSize={MAXIMUM_PROFILE_PICTURE_SIZE}
					className={classes.uploader}
					imageUrl={controller.imageUrl}
					active={controller.isDraggingOver}
					onDrop={controller.onDrop}
					onDragEnter={() => controller.onDragEnter()}
					onDragLeave={() => controller.onDragLeave()}
					state={isDisabled ? "disabled" : "default"}
				/>

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