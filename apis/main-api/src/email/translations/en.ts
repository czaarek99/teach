import { PRODUCT_NAME } from "common-library";

export default {
	email: {
		passwordReset: `
			Here's a link to reset your password: {link}
		`,

		passwordHelp: `
			You requested a password reset request for {email} but there is no
			account with that email.
		`,

		welcome: `
			Welcome to ${PRODUCT_NAME}
		`
	}

}