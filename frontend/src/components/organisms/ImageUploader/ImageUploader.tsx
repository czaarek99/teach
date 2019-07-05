import React from "react";
import Dropzone from "react-dropzone";
import UploadIcon from "@material-ui/icons/CloudUpload";
import EditIcon from "@material-ui/icons/Edit";
import clsx from "clsx";

import { observer } from "mobx-react";
import { WithStyles, createStyles } from "@material-ui/styles";
import { Theme, withStyles } from "@material-ui/core";

type ImageUploaderState = "default" | "disabled";

interface IImageUploaderProps {
	maxSize: number

	active?: boolean
	state?: ImageUploaderState
	imageUrl?: string
	className?: string
	multiple?: boolean

	onDrop: (file: File[]) => void
	onDragEnter?: () => void
	onDragLeave?: () => void
}

const styles = (theme: Theme) => createStyles({

	dropzone: {
		borderWidth: 2,
		borderColor: theme.palette.primary.main,
		borderStyle: "solid",
		borderRadius: 3,
		cursor: "pointer",
		outline: "none",
		backgroundSize: "contain",
		position: "relative",
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
class ImageUploader extends React.Component<
	IImageUploaderProps &
	WithStyles<typeof styles>
> {

	public static defaultProps : Partial<IImageUploaderProps> = {
		state: "default",
		active: false,
		onDragEnter: () => {},
		onDragLeave: () => {},
		multiple : false
	}

	public render() : React.ReactNode {

		const {
			onDrop,
			maxSize,
			state,
			classes,
			className,
			active,
			onDragEnter,
			onDragLeave,
			imageUrl,
			multiple
		} = this.props;

		const overlayClasses = clsx(classes.overlay, {
			[classes.activeOverlay]: active
		});

		const dropzoneClasses = clsx(classes.dropzone, className);

		let dropzoneStyle : React.CSSProperties;
		if(imageUrl) {
			dropzoneStyle = {
				backgroundImage: `url(${imageUrl})`
			};
		}

		return (
			<Dropzone onDrop={(files: File[]) => onDrop(files)}
				onDragEnter={() => onDragEnter ? onDragEnter() : null}
				onDragLeave={() => onDragLeave ? onDragLeave() : null}
				accept="image/*"
				maxSize={maxSize}
				multiple={multiple}
				noKeyboard={true}
				disabled={state === "disabled"}>

				{(props) => (
					<div {...props.getRootProps()}
						style={dropzoneStyle}
						className={dropzoneClasses}>

						<input {...props.getInputProps()}/>

						<div className={overlayClasses}>
							{imageUrl ?
								<EditIcon fontSize="large"/> :
								<UploadIcon fontSize="large" />
							}
						</div>
					</div>
				)}
			</Dropzone>
		)
	}

}

export default withStyles(styles)(ImageUploader);