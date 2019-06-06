import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/spa/App';
import en from './translations/en';
import theme from './theme/theme';

import { IntlProvider } from 'react-intl';
import { AppController } from './controllers/AppController';
import { ThemeProvider } from '@material-ui/styles';
import { Router } from 'react-router';
import { syncHistoryWithStore, RouterStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';

const appController = new AppController();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(createBrowserHistory(), routingStore);

ReactDOM.render(
	(
		<Provider routingStore={routingStore}>
			<Router history={history}>
				<ThemeProvider theme={theme}>
					<IntlProvider locale="en" messages={en}>
						<App controller={appController} />
					</IntlProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	),
	document.getElementById('root')
);