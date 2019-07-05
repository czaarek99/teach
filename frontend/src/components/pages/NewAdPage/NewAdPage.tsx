import React from 'react';
import InfoIcon from "@material-ui/icons/Info";
import EditIcon from "@material-ui/icons/Edit";

import { INavbarController } from "../../../interfaces/controllers/templates/INavbarController";
import { INewAdPageController } from "../../../interfaces/controllers/pages/INewAdPageController";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { NavbarTemplate } from "../../templates";
import { CustomTextField, LoadingButton } from "../../molecules";
import { simpleFormat } from "../../../util/simpleFormat";

import {
	AD_NAME_MAX_LENGTH,
	AD_NAME_MIN_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH
} from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Paper,
	Snackbar,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	content: {
		display: "flex",
		justifyContent: "center"
	},

	paper: {
		padding: 10,
		maxWidth: 1000
	},

	field: {
		marginBottom: 10
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},
});

interface INewAdPageProps {
	navbarController: INavbarController
	controller: INewAdPageController
}

@observer
class NewAdPage extends React.Component<
	INewAdPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			navbarController,
			controller,
			classes
		} = this.props;

		const adNameLabel = simpleFormat(this, "things.adName");
		const descriptionLabel = simpleFormat(this, "things.description");

		let errorSnackbar = null;
		if(controller.pageError) {
			errorSnackbar = (
				<Snackbar open={true}
					key={controller.pageError}
					ContentProps={{
						"className": classes.errorSnackbarContent
					}}
					action={
						<Button onClick={() => controller.onCloseSnackbar()}>
							<FormattedMessage id="actions.ok"/>
						</Button>
					}
					message={
						<FormattedMessage id={controller.pageError}/>
					}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "center"
					}}
					onClose={() => controller.onCloseSnackbar()}/>
			);
		}

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.content}>
					<Paper className={classes.paper}>
						<CustomTextField
							className={classes.field}
							value={controller.model.name}
							minLength={AD_NAME_MIN_LENGTH}
							maxLength={AD_NAME_MAX_LENGTH}
							label={adNameLabel}
							required={true}
							onChange={event => controller.onChange("name", event.target.value)}
							startAdornment={ <InfoIcon /> }
							errorModel={controller.errorModel}
							validationKey="name"
							errorTranslationValues={{
								value: adNameLabel,
								minLength: AD_NAME_MIN_LENGTH,
								maxLength: AD_NAME_MAX_LENGTH
							}}
						/>

						<CustomTextField
							rows={10}
							className={classes.field}
							multiline={true}
							value={controller.model.description}
							minLength={AD_DESCRIPTION_MIN_LENGTH}
							maxLength={AD_DESCRIPTION_MAX_LENGTH}
							label={descriptionLabel}
							required={true}
							onChange={event => controller.onChange("description", event.target.value)}
							errorModel={controller.errorModel}
							validationKey="description"
							errorTranslationValues={{
								value: adNameLabel,
								minLength: AD_DESCRIPTION_MIN_LENGTH,
								maxLength: AD_DESCRIPTION_MAX_LENGTH
							}}
						/>

						<LoadingButton onClick={() => controller.onSave()}
							state={controller.saveButtonState}>
							<FormattedMessage id="actions.save"/>
						</LoadingButton>
					</Paper>
				</div>

				{errorSnackbar}
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(NewAdPage));