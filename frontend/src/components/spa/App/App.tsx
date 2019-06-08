import React from 'react';

import { IAppController } from '../../../interfaces/controllers/IAppController';
import { observer, inject } from 'mobx-react';
import { Routes } from '../../../interfaces/Routes';
import { LoginPage, RegistrationPage, ForgotPage, ResetPasswordPage } from '../../pages';
import { IRoutingStoreProps } from '../../../interfaces/props/IRoutingStoreProps';

interface IAppProps {
	controller: IAppController
}

type AllProps = IAppProps & IRoutingStoreProps;

@inject("routingStore")
@observer
class App extends React.Component<IAppProps> {

	public render() : React.ReactNode {

		const {
			controller,
			routingStore
		} = this.props as AllProps;

		const pathName = routingStore.location.pathname;
		let page = null;

		if(pathName === Routes.LOGIN) {
			page = (
				<LoginPage controller={controller.loginPageController} />
			)
		} else if(pathName === Routes.REGISTRATION) {
			page = (
				<RegistrationPage controller={controller.registrationPageController} />
			)
		} else if(pathName === Routes.FORGOT_PASSWORD) {
			page = (
				<ForgotPage controller={controller.forgotPageController} />
			)
		} else if(pathName === Routes.RESET_PASSWORD) {
			page = (
				<ResetPasswordPage controller={controller.resetPasswordPageController}/>
			)
		}

		return page;
	}

}

export default App;