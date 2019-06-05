import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/spa/App';
import en from './translations/en';
import theme from './theme/theme';

import { IntlProvider } from 'react-intl';
import { AppController } from './controllers/AppController';
import { ThemeProvider } from '@material-ui/styles';

const appController = new AppController();

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<IntlProvider locale="en" messages={en}>
			<App controller={appController} />
		</IntlProvider>
	</ThemeProvider>
, document.getElementById('root'));