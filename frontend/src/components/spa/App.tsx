import React from 'react';
import LoginPage from '../pages/LoginPage';
import { IAppController } from '../../interfaces/controllers/IAppController';
import { observer, inject } from 'mobx-react';
import { Router } from 'react-router';
import { Routes } from '../../interfaces/Routes';
import { RouterStore } from 'mobx-react-router';
import RegistrationPage from '../pages/RegistrationPage';

interface IAppProps {
	controller: IAppController
}

interface IAppInternalProps {
	routingStore: RouterStore
}

type AllProps = IAppProps & IAppInternalProps;

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

		if(pathName === Routes.LOGIN_PAGE) {
			page = (
				<LoginPage controller={controller.loginPageController} />
			)
		} else if(pathName === Routes.REGISTRATION_PAGE) {
			page = (
				<RegistrationPage controller={controller.registrationPageController} />
			)
		}

		return page;
	}

}

export default App;