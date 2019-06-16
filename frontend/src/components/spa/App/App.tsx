import React from 'react';

import { IAppController } from '../../../interfaces/controllers/IAppController';
import { observer, inject } from 'mobx-react';
import { Routes } from '../../../interfaces/Routes';
import { LoginPage, RegistrationPage, ForgotPage, ResetPasswordPage, BrowsePage, HomePage } from '../../pages';
import { IRoutingStoreProps } from '../../../interfaces/props/IRoutingStoreProps';

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
			[Routes.BROWSE]: () =>
				<BrowsePage controller={controller.browsePageController}/>,
			[Routes.HOME]: () =>
				<HomePage />
		};

		const pathName = routingStore.location.pathname;
		const page = pages[pathName];

		if(page) {
			return page();
		} else {
			return null;
		}
	}

}

export default App;