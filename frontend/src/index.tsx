import React from 'react';
import ReactDOM from 'react-dom';
import DateFnsUtils from "@date-io/date-fns";
import englishLocale from "i18n-iso-countries/langs/en.json";
import translations from './translations';

import { IntlProvider } from 'react-intl';
import { AppController } from './controllers/AppController';
import { ThemeProvider } from '@material-ui/styles';
import { Router } from 'react-router';
import { Provider } from 'mobx-react';
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { App } from './components';
import { registerLocale } from "i18n-iso-countries";
import { RootStore } from "./stores/RootStore";
import { IServices } from "./interfaces/services/IServices";
import { SettingsService } from "./services/SettingsService";
import { AuthenticationService } from "./services/AuthenticationService";
import { UserService } from "./services/UserService";
import { AdService } from "./services/AdService";
import { ImageService } from "./services/ImageService";
import { DMService } from "./services/DMService";
import { defaultTheme } from "./theme";

registerLocale(englishLocale);

const services : IServices = {
	settingsService: new SettingsService(),
	authenticationService: new AuthenticationService(),
	userService: new UserService(),
	adService: new AdService(),
	imageService: new ImageService(),
	dmService: new DMService()
};

const rootStore = new RootStore(services);
const appController = new AppController(rootStore);

ReactDOM.render(
	(
		<Provider routingStore={rootStore.routingStore}>
			<Router history={rootStore.getHistory()}>
				<ThemeProvider theme={defaultTheme}>
					<IntlProvider locale="en" messages={translations.en}>
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