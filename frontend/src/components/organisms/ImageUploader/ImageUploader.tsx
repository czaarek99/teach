import React from "react";
import Dropzone from "react-dropzone";
import clsx from "clsx";

import { observer } from "mobx-react";
import { WithStyles, createStyles } from "@material-ui/styles";
import { Theme, withStyles } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";

type ImageUploaderState = "default" | "disabled";

interface IImageUploaderProps {
	maxSize: number

	active?: boolean
	state?: ImageUploaderState
	imageUrl?: string
	className?: string
	multiple?: boolean
	showOverlay?: boolean

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
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center"
	},

	overlay: {
		position: "absolute",
		top: 0,
		opacity: 0,
		left: 0,
		width: "100%",
		height: "100%",
		backgroundColor: `${theme.palette.grey[200]}aa`,
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
		multiple: false,
		showOverlay: true,
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
			multiple,
			showOverlay,
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

		let overlay: React.ReactNode;
		if(showOverlay) {
			overlay = (
				<div className={overlayClasses}>
					{imageUrl ?
						<FontAwesomeIcon icon={faPen} size="2x"/> :
						<FontAwesomeIcon icon={faCloudUploadAlt} size="2x" />
					}
				</div>
			)
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

						{overlay}
					</div>
				)}
			</Dropzone>
		)
	}

}

export default withStyles(styles)(ImageUploader);