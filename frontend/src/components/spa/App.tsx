import React from 'react';
import LoginPage from '../pages/LoginPage';
import { IAppController } from '../../interfaces/controllers/IAppController';
import { observer } from 'mobx-react';

interface IAppProps {
	controller: IAppController
}

@observer
class App extends React.Component<IAppProps> {

	public render() : React.ReactNode {
		const controller = this.props.controller;

		return (
			<LoginPage controller={controller.loginPageController}/>
		)
	}

}

export default App;
