import * as React from "react";

import PersonalInformationContent from "./internal/PersonalInformationContent";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { getTextFieldErrorState } from "../../../validation/getErrorState";
import { InfoBox, CustomTextField, LoadingButton } from "../../molecules";

import {
	IRegistrationPageController
} from "../../../interfaces/controllers/IRegistrationPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Box,
	Typography,
	Paper,
} from "@material-ui/core";

import {
	EMAIL_MIN_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
} from "common-library";

const styles = (theme: Theme) => createStyles({


});

export interface IRegistrationContentProps {
	margin: string
	isDisabled: boolean
	controller: IRegistrationPageController
}

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

								<Typography variant="h5">
									{registerLabel}
								</Typography>
							</Box>

							<PersonalInformationContent controller={controller}
								margin={margin}
								isDisabled={isDisabled}/>


							<Box>
								<Box marginBottom={margin}
									display="flex"
									justifyContent="center">


									<Typography variant="h6">
										<FormattedMessage id="things.address"/>
									</Typography>
								</Box>


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