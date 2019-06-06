import * as React from "react";


import { observer } from "mobx-react";
import { Theme, createStyles, WithStyles, withStyles, Box, Paper, Typography, TextField } from "@material-ui/core";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { IRegistrationPageController } from "../../interfaces/controllers/IRegistrationPageController";
import { simpleFormat } from "../../util/simpleFormat";
import InfoBox from "../InfoBox";
import { getTextFieldErrorState } from "../../validation/getErrorState";
import LoadingButton from "../LoadingButton";

const styles = (theme: Theme) => createStyles({
	registerText: {
		fontWeight: 600
	},


});

interface IRegistrationPageProps {
	controller: IRegistrationPageController
}

@observer
class RegistrationPage extends React.Component<
	IRegistrationPageProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes,
			intl
		} = this.props;

		const margin = "10px";
		const isDisabled = controller.loading;

		const registerLabel = simpleFormat(this, "actions.register");
		const emailLabel = simpleFormat(this, "things.email");
		const passwordLabel = simpleFormat(this, "things.password");
		const firstNameLabel = simpleFormat(this, "things.firstName");
		const lastNameLabel = simpleFormat(this, "things.lastName");
		const zipCodeLabel = simpleFormat(this, "things.zipCode");
		const streetLabel = simpleFormat(this, "things.street");
		const addressLabel = simpleFormat(this, "things.address");
		const countryLabel = simpleFormat(this, "things.country");
		const stateLabel = simpleFormat(this, "things.state");

		let errorBox = null;

		if(controller.errorMessage !== null) {
			errorBox = (
				<InfoBox type="error">
					<Typography>
						<FormattedMessage id={controller.errorMessage}/>
					</Typography>
				</InfoBox>
			);
		}

		return (
			<Box display="flex"
				justifyContent="center"
				alignItems="center"
				height="100%">

				<Box width="300px">
					<Paper>
						<Box padding={margin}>
							<Box marginBottom={margin}
								display="flex"
								justifyContent="center">

								<Typography className={classes.registerText}>
									{registerLabel}
								</Typography>
							</Box>

							<Box marginBottom={margin}>
								<TextField variant="outlined"
									disabled={isDisabled}
									value={controller.registrationModel.firstName}
									fullWidth={true}
									label={firstNameLabel}
									required={true}
									onChange={event => controller.onChange("firstName", event.target.value)}
									{...getTextFieldErrorState(
										intl,
										controller.registrationErrorModel,
										"firstName",
										{
											value: firstNameLabel
										}
									)}


								/>
							</Box>

							{errorBox}

							<Box justifyContent="flex-end"
								display="flex"
								marginTop={margin}>

								<LoadingButton state={controller.registerButtonState}
									onClick={() => controller.onRegister()}>

									{registerLabel}

								</LoadingButton>

							</Box>
						</Box>
					</Paper>
				</Box>
			</Box>
		)
	}
}

export default withStyles(styles)(injectIntl(RegistrationPage));