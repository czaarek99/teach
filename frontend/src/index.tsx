import React from 'react';
import ReactDOM from 'react-dom';
import en from './translations/en';
import theme from './theme/theme';
import DateFnsUtils from "@date-io/date-fns";
import englishLocale from "i18n-iso-countries/langs/en.json";

import { IntlProvider } from 'react-intl';
import { AppController } from './controllers/AppController';
import { ThemeProvider } from '@material-ui/styles';
import { Router } from 'react-router';
import { syncHistoryWithStore, RouterStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'mobx-react';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { App } from './components';
import { registerLocale } from "i18n-iso-countries";

registerLocale(englishLocale);

const appController = new AppController();
const routingStore = new RouterStore();
const history = syncHistoryWithStore(createBrowserHistory(), routingStore);

ReactDOM.render(
	(
		<Provider routingStore={routingStore}>
			<Router history={history}>
				<ThemeProvider theme={theme}>
					<IntlProvider locale="en" messages={en}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<App controller={appController} />
						</MuiPickersUtilsProvider>
					</IntlProvider>
				</ThemeProvider>
			</Router>
		</Provider>
	),
	document.getElementById('root')
);