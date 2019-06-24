import { createMuiTheme } from "@material-ui/core";
import { pink, cyan } from "@material-ui/core/colors";

export default createMuiTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 768,
			md: 992,
			lg: 1200,
			xl: 1600
		}
	},

	palette: {
		success: {
			light: "#66BB6A",
			main: "#4CAF50",
			dark: "#388E3C"
		},

		primary: {
			main: pink[400]
		},

		secondary: {
			main: cyan[500]
		}
	},

	typography: {
		fontFamily: [
			"Roboto Mono, monospace",
			"Helvetica",
			"sans-serif"
		].join(",")
	}
});