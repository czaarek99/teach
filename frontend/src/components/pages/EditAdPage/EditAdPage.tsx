import React from 'react';
import AdImageUploader from "./internal/AdImageUploader";

import { IEditAdPageController, INavbarController } from "../../../interfaces";
import { simpleFormat } from "../../../util";
import { NavbarTemplate } from "../../templates";
import { CustomTextField } from "../../molecules";
import { AdCategorySelect, SaveButtons, ErrorSnackbar } from "../../organisms";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	InjectedIntlProps,
	injectIntl,
	FormattedMessage
} from "react-intl";

import {
	AD_NAME_MAX_LENGTH,
	AD_NAME_MIN_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
} from "common-library";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Paper,
	Button,
	Checkbox,
	FormControlLabel,
} from "@material-ui/core";

export const MEDIUM_BREAKPOINT = "@media screen and (min-width: 400px)";
export const LARGE_BREAKPOINT = "@media screen and (min-width: 560px)";
export const X_LARGE_BREAKPOINT = "@media screen and (min-width: 980px)";
export const XX_LARGE_BREAKPOINT = "@media screen and (min-width: 1400px)";

export const UPLOADER_BORDER = 2;
const PAPER_PADDING = 10;

const styles = (theme: Theme) => createStyles({
	content: {
		display: "flex",
		justifyContent: "center",
	},

	paper: {
		padding: PAPER_PADDING,

		width: 300,

		[MEDIUM_BREAKPOINT]: {
			width: 380 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[LARGE_BREAKPOINT]: {
			width: 430 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[X_LARGE_BREAKPOINT]: {
			width: 600 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		},

		[XX_LARGE_BREAKPOINT]: {
			width: 800 + PAPER_PADDING * 2 + UPLOADER_BORDER * 2
		}
	},

	field: {
		marginBottom: 10
	},

	description: {
		marginBottom: 10,
		marginTop: 10
	},

	errorSnackbarContent: {
		backgroundColor: theme.palette.error.dark
	},
});

interface INewAdPageProps {
	navbarController: INavbarController
	controller: IEditAdPageController
}

@observer
class EditAdPage extends React.Component<
	INewAdPageProps &
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public componentDidMount() : void {
		const onWindowResize = this.props.controller.onWindowResize;
		window.addEventListener("resize", onWindowResize);
		onWindowResize();
	}

	public componentWillUnmount() : void {
		window.removeEventListener("resize", this.props.controller.onWindowResize);
	}

	private renderErrorSnackbar() : React.ReactNode {

		const {
			controller,
		} = this.props;

		return (
			<ErrorSnackbar errorMessage={controller.pageError}
				onClose={() => controller.onCloseSnackbar()}
				action={
					<Button onClick={() => controller.onCloseSnackbar()}>
						<FormattedMessage id="actions.ok"/>
					</Button>
				}
			/>
		);
	}

	public render() : React.ReactNode {

		const {
			navbarController,
			controller,
			classes,
		} = this.props;

		const adNameLabel = simpleFormat(this, "things.adName");
		const descriptionLabel = simpleFormat(this, "things.description");
		const privateLabel = simpleFormat(this, "things.private");

		const isDisabled = controller.loading;

		const privateCheckbox = (
			<Checkbox checked={controller.viewModel.private}
				disabled={isDisabled}
				onChange={(_, checked: boolean) => controller.onChange("private", checked)}/>
		);

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.content}>
					<Paper className={classes.paper}>
						<CustomTextField
							disabled={isDisabled}
							className={classes.field}
							value={controller.viewModel.name}
							minLength={AD_NAME_MIN_LENGTH}
							maxLength={AD_NAME_MAX_LENGTH}
							label={adNameLabel}
							required={true}
							onChange={event => controller.onChange("name", event.target.value)}
							startAdornment={ <FontAwesomeIcon icon={faInfo} /> }
							errorModel={controller.errorModel}
							validationKey="name"
							errorTranslationValues={{
								value: adNameLabel,
								minLength: AD_NAME_MIN_LENGTH,
								maxLength: AD_NAME_MAX_LENGTH
							}}
						/>

						<AdImageUploader controller={controller}/>

						<CustomTextField
							disabled={isDisabled}
							rows={controller.descriptionRows}
							className={classes.description}
							multiline={true}
							value={controller.viewModel.description}
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


						<AdCategorySelect value={controller.viewModel.category}
							disabled={isDisabled}
							required={true}
							errorMessage={controller.errorModel.getFirstKeyError("category")}
							onChange={category => controller.onChange("category", category)}/>

						<div>
							<FormControlLabel control={privateCheckbox}
								label={privateLabel}/>
						</div>

						<SaveButtons onSave={() => controller.onSave()}
							onReset={() => controller.onReset()}
							showReset={controller.showReset}
							saveButtonState={controller.saveButtonState}/>
					</Paper>
				</div>

				{this.renderErrorSnackbar()}
			</NavbarTemplate>
		)
	}
}

export default withStyles(styles)(injectIntl(EditAdPage));