import React from 'react';

import { Theme, createStyles, WithStyles, withStyles } from '@material-ui/core';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { IResetPasswordPageController } from '../../../interfaces/controllers/pages/IResetPasswordPageController';

const styles = (theme: Theme) => createStyles({

});

interface IResetPasswordPageProps {
	controller: IResetPasswordPageController
}

export class ResetPasswordPage extends React.Component<
	IResetPasswordPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {
		return (
			<div></div>
		)
	}

}

export default withStyles(styles)(injectIntl(ResetPasswordPage));