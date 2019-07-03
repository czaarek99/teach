import React from 'react';

import { IAppController } from '../../../interfaces/controllers/IAppController';
import { observer, inject } from 'mobx-react';
import { Route } from '../../../interfaces/Routes';
import { IRoutingStoreProps } from '../../../interfaces/props/IRoutingStoreProps';
import { CssBaseline } from '@material-ui/core';

import {
	LoginPage,
	RegistrationPage,
	ForgotPage,
	ResetPasswordPage,
	BrowsePage,
	HomePage,
	AdPage,
	ProfilePage
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
			[Route.LOGIN]: () => (
				<LoginPage controller={controller.loginPageController} />
			),
			[Route.REGISTRATION]: () => (
				<RegistrationPage controller={controller.registrationPageController} />
			),
			[Route.FORGOT_PASSWORD]: () => (
				<ForgotPage controller={controller.forgotPageController} />
			),
			[Route.RESET_PASSWORD]: () => (
				<ResetPasswordPage controller={controller.resetPasswordPageController}/>
			),
			[Route.BROWSE]: () => (
				<BrowsePage controller={controller.browsePageController}
					navbarController={controller.navbarController}/>
			),
			[Route.AD]: () => (
				<AdPage controller={controller.adPageController}
					navbarController={controller.navbarController}/>
			),
			[Route.HOME]: () => (
				<HomePage />
			),
			[Route.PROFILE]: () => (
				<ProfilePage controller={controller.profilePageController}
					navbarController={controller.navbarController}/>
			)
		};

		const pathName = routingStore.location.pathname;
		const page = pages[pathName];

		return (
			<React.Fragment>
				<CssBaseline />
				{page && page()}
			</React.Fragment>
		);
	}

}

export default App;
