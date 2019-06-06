import * as React from "react";

import clsx from "clsx";

import {
	Theme,
	WithStyles,
	Button,
	createStyles,
	withStyles,
	CircularProgress,
	Box
} from "@material-ui/core";

export type LoadingButtonState = "loading" | "success" | "error" | "disabled" | "default";

interface ILoadingButtonProps {
	onClick: () => void
	state: LoadingButtonState
	className?: string
}

const styles = (theme: Theme) => createStyles({
	root: {
		position: "relative"
	},

	successButton: {
		backgroundColor: theme.palette.success.main,

		"&:hover": {
			backgroundColor: theme.palette.success.dark
		}

	},

	errorButton: {
		backgroundColor: theme.palette.error.main,

		"&:hover": {
			backgroundColor: theme.palette.error.dark
		}
	},
});

class LoadingButton extends React.Component<ILoadingButtonProps & WithStyles<typeof styles>> {

	public render() : React.ReactNode {

		const {
			state,
			children,
			classes,
			className,
			onClick
		} = this.props;

		const isLoading = state === "loading";

		const buttonClasses = clsx(className, classes.root, {
			[classes.errorButton]: state === "error",
			[classes.successButton]: state === "success"
		});

		let progress = null;

		if(isLoading) {
			progress = (
				<Box position="absolute"
					height="100%"
					width="100%"
					display="flex"
					alignItems="center"
					justifyContent="center">

					<CircularProgress size={24}/>
				</Box>
			)
		}

		const isDisabled = isLoading || state === "disabled";

		return (
			<Button disabled={isDisabled}
				onClick={onClick}
				className={buttonClasses}
				variant="contained">
				{children}
				{progress}
			</Button>
		)
	}

}

export default withStyles(styles)(LoadingButton);