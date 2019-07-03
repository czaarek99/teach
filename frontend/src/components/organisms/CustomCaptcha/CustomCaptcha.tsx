import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

import {
	WithStyles,
	Theme,
	createStyles,
	withStyles,
	Typography
} from "@material-ui/core";

export type OnFunctions = (functions: IRecaptchaFunctions) => void

export interface IRecaptchaFunctions {
	reset: () => void
}

interface ICustomCaptchaProps {
	onChange: (value: string | null) => void
	onFunctions?: OnFunctions
	error?: string | null
}

const RECAPTCHA_HEIGHT = 78;

const styles = (theme: Theme) => createStyles({
	captchaContainer: {
		minHeight: RECAPTCHA_HEIGHT
	},

	title: {
		fontSize: 17,
		fontWeight: "bold"
	},

	error: {
		fontSize: 12,
		margin: "2px 12px 0 12px"
	}
})

export class CustomCaptcha extends React.Component<
	ICustomCaptchaProps &
	WithStyles<typeof styles>
> {

	private readonly captchaRef = React.createRef<ReCAPTCHA>();

	public componentDidMount() {
		const ref = this.captchaRef.current;
		const onFunctions = this.props.onFunctions;

		if(ref && onFunctions) {
			onFunctions({
				reset: () : void => {
					ref.reset();
				}
			})
		}

	}

	public render() : React.ReactNode {

		const {
			onChange,
			classes,
			error
		} = this.props;

		return (
			<div>
				<Typography className={classes.title}>
					Captcha
				</Typography>

				<div className={classes.captchaContainer}>
					<ReCAPTCHA onChange={onChange}
						size="compact"
						ref={this.captchaRef}
						sitekey="6LfR7g8TAAAAADQnlcRjUoCobU6725fEXSItaNPe"/>
				</div>

				<Typography color="error"
					className={classes.error}>

					{error}
				</Typography>
			</div>
		)
	}

}

export default withStyles(styles)(CustomCaptcha)