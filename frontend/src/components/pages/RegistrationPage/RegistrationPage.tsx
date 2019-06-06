import * as React from "react";

import PersonalInformationContent from "./internal/PersonalInformationContent";
import AccountDetailsContent from "./internal/AccountDetailsContent";
import AddressContent from "./internal/AddressContent";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";
import { InfoBox, LoadingButton } from "../../molecules";

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
		} = this.props;

		const margin = "10px";
		const isDisabled = controller.loading;

		const registerLabel = simpleFormat(this, "actions.register");

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
				padding="20px"
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

							<AccountDetailsContent controller={controller}
								margin={margin}
								isDisabled={isDisabled}/>

							<AddressContent controller={controller}
								margin={margin}
								isDisabled={isDisabled}/>

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