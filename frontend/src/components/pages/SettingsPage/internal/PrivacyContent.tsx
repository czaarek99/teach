import React from 'react';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../../util";
import { ISettingsPageController } from "../../../../interfaces";

import {
	WithStyles,
	Theme,
	createStyles,
	withStyles,
	Typography,
	FormControlLabel,
	Checkbox
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

});

interface IPrivacyContentProps {
	controller: ISettingsPageController
}

@observer
class PrivacyContent extends React.Component<
	IPrivacyContentProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			controller
		} = this.props;

		const showEmailLabel = simpleFormat(this, "things.settings.showEmail");
		const showPhoneLabel = simpleFormat(this, "things.settings.showPhone");

		const isDisabled = controller.loading;

		const showEmailCheckbox = (
			<Checkbox checked={controller.viewModel.showEmail}
				disabled={isDisabled}
				onChange={(_, checked: boolean) => controller.onChange("showEmail", checked)}/>
		);

		const showPhoneCheckbox = (
			<Checkbox checked={controller.viewModel.showPhone}
				disabled={isDisabled}
				onChange={(_, checked: boolean) => controller.onChange("showPhone", checked)}/>
		);

		return (
			<div>
				<Typography variant="h6">
					<FormattedMessage id="things.privacySettings"/>
				</Typography>

				<FormControlLabel control={showEmailCheckbox}
					label={showEmailLabel} />

				<FormControlLabel control={showPhoneCheckbox}
					label={showPhoneLabel}/>

			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(PrivacyContent));