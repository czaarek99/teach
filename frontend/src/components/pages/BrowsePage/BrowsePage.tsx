import React from 'react';

import { Ad } from '../../organisms';
import { observer } from 'mobx-react';
import { NavbarTemplate } from '../../templates';

import { 
	createStyles, 
	Theme, 
	WithStyles, 
	withStyles, 
	TablePagination,
	CircularProgress } from "@material-ui/core";

import { 
	IBrowsePageController 
} from '../../../interfaces/controllers/pages/IBrowsePageController';

import { 
	INavbarController 
} from '../../../interfaces/controllers/templates/INavbarController';


const styles = (theme: Theme) => createStyles({

	root: {
		width: "100%"
	},

	progressContainer: {
		height: "100vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},

	adsContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		flexWrap: "wrap"
	},

	disabledPagination: {
		opacity: .4,
		cursor: "not-allowed",
		pointerEvents: "none"
	},


});

interface IBrowsePageProps {
	controller: IBrowsePageController
	navbarController: INavbarController
}

@observer
export class BrowsePage extends React.Component<
	IBrowsePageProps & 
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller,
			navbarController
		} = this.props;

		const ads = controller.activeAdControllers.map((controller) => {
			return (
				<Ad controller={controller} key={controller.controllerId}/>
			)
		});

		let paginationClassName = "";
		if(controller.listLoading) {
			paginationClassName = classes.disabledPagination;
		}

		let content = null;

		if(controller.pageLoading) {
			content = (
				<div className={classes.progressContainer}>
					<CircularProgress size={50}/>
				</div>
			);
		} else {
			content = (
				<React.Fragment>
					<div className={classes.adsContainer}>
						{ads}
					</div>

					<TablePagination component="div" 
						className={paginationClassName}
						rowsPerPage={controller.adsPerPage}
						page={controller.pageNumber}
						count={controller.totalAdCount} 
						onChangeRowsPerPage={controller.onChangeAdsPerPage}
						onChangePage={controller.onChangePage}/>
				</React.Fragment>
			)
		}

		return (
			<NavbarTemplate controller={navbarController}>
				<div className={classes.root}>
					{content}
				</div>
			</NavbarTemplate>

		)
	}

}

export default withStyles(styles)(BrowsePage);
