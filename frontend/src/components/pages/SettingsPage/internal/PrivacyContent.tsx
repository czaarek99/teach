import React from 'react';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";

import {
	ISettingsPageController
} from "../../../../interfaces/controllers/pages/ISettingsPageController";

import {
	WithStyles,
	Theme,
	createStyles,
	withStyles,
	Typography,
	FormControlLabel
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
		return (
			<div>
				<Typography variant="h6">
					<FormattedMessage id="things.privacySettings"/>
				</Typography>

			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(PrivacyContent));