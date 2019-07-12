import React from 'react';
import SearchIcon from "@material-ui/icons/Search";

import { IBrowsePageController } from "../../../../interfaces/controllers/pages/IBrowsePageController";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { fade } from "@material-ui/core/styles";
import { AdCategorySelect, CustomDatePicker } from "../../../organisms";
import { LoadingButton } from "../../../molecules";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	Paper,
	Typography,
	InputBase,
	Button
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexGrow: 0
	},

	paper: {
		padding: 10,
		maxWidth: 500
	},

	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		marginBottom: 10,
		backgroundColor: fade(theme.palette.primary.main, 0.15),

		'&:hover': {
			backgroundColor: fade(theme.palette.primary.main, 0.25),
		},
	},

	inputRoot: {
		color: 'inherit',
	},

	inputInput: {
		padding: theme.spacing(1, 1, 1, 7),
		transition: theme.transitions.create('width'),
		width: '100%',
	},

	searchIcon: {
		width: theme.spacing(7),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},

	datePicker: {
		marginBottom: 10
	},

	categorySelect: {
		marginBottom: 10
	},

	clearButton: {
		marginRight: 10
	}

});

interface IAdFilterProps {
	controller: IBrowsePageController
}

@observer
class AdFilter extends React.Component<
	IAdFilterProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		return (
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<Typography variant="h6">
						<FormattedMessage id="things.adFilter"/>
					</Typography>

					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>

						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'Search' }}
						/>
					</div>

					<AdCategorySelect value={controller.adFilterModel.category}
						className={classes.categorySelect}
						onChange={category => controller.onChangeFilter("category", category)}/>


					<CustomDatePicker
						className={classes.datePicker}
						value={controller.adFilterModel.startPublishDate}
						maxDate={new Date()}
						onChange={date => controller.onChangeFilter("startPublishDate", date)}
						label={
							<FormattedMessage id="things.startDate"/>
						}/>

					<CustomDatePicker
						className={classes.datePicker}
						value={controller.adFilterModel.endPublishDate}
						minDate={new Date()}
						onChange={date => controller.onChangeFilter("endPublishDate", date)}
						label={
							<FormattedMessage id="things.endDate"/>
						}/>

					<div>
						<Button variant="contained"
							className={classes.clearButton}>

							<FormattedMessage id="actions.clear"/>
						</Button>

						<LoadingButton onClick={() => controller.onFilter()}
							state={controller.filterButtonState}>

							<FormattedMessage id="things.filter"/>
						</LoadingButton>
					</div>
				</Paper>
			</div>
		);
	}
}

export default withStyles(styles)(injectIntl(AdFilter));