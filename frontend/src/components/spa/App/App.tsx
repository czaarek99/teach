import React from 'react';

import { IAppController } from '../../../interfaces/controllers/IAppController';
import { observer, inject } from 'mobx-react';
import { Routes } from '../../../interfaces/Routes';
import { IRoutingStoreProps } from '../../../interfaces/props/IRoutingStoreProps';
import { CssBaseline } from '@material-ui/core';

import { 
	LoginPage, 
	RegistrationPage, 
	ForgotPage, 
	ResetPasswordPage, 
	BrowsePage, 
	HomePage 
} from '../../pages';

interface IAppProps {
	controller: IAppController
}

type AllProps = IAppProps & IRoutingStoreProps;

interface IPages {
	[key: string]: () => React.ReactNode
}

@inject("routingStore")
@observer
class App extends React.Component<IAppProps> {

	public render() : React.ReactNode {

		const {
			controller,
			routingStore
		} = this.props as AllProps;

		const pages : IPages = {
			[Routes.LOGIN]: () =>
				<LoginPage controller={controller.loginPageController} />,
			[Routes.REGISTRATION]: () =>
				<RegistrationPage controller={controller.registrationPageController} />,
			[Routes.FORGOT_PASSWORD]: () =>
				<ForgotPage controller={controller.forgotPageController} />,
			[Routes.RESET_PASSWORD]: () =>
				<ResetPasswordPage controller={controller.resetPasswordPageController}/>,
			[Routes.BROWSE]: () => (
				<BrowsePage controller={controller.browsePageController} 
					navbarController={controller.navbarController}/>
			),
			[Routes.HOME]: () =>
				<HomePage />
		};

		const pathName = routingStore.location.pathname;
		const page = pages[pathName];

		return (
			<React.Fragment>
				<CssBaseline />
				{page()}
			</React.Fragment>
		);
	}

}

export default App;