import React from 'react';

import { Ad } from '../../organisms';
import { observer } from 'mobx-react';
import { NavbarTemplate } from '../../templates';
import { LabelDisplayedRowsArgs } from "@material-ui/core/TablePagination";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { simpleFormat } from "../../../util/simpleFormat";

import {
	createStyles,
	Theme,
	WithStyles,
	withStyles,
	TablePagination,
	CircularProgress,
	Typography} from "@material-ui/core";

import {
	IBrowsePageController
} from '../../../interfaces/controllers/pages/IBrowsePageController';

import {
	INavbarController
} from '../../../interfaces/controllers/templates/INavbarController';
import { InfoBox } from "../../molecules";


const styles = (theme: Theme) => createStyles({

	paginatedContainer: {
		minHeight: "100%"
	},

	messageContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},

	progressContainer: {
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
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller,
			navbarController,
			intl
		} = this.props;

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
		} else if(controller.activeAdControllers.length === 0)  {
			content = (
				<div className={classes.messageContainer}>
					<InfoBox type="default">
						<Typography>
							<FormattedMessage id="info.noAds"/>
						</Typography>
					</InfoBox>
				</div>
			);
		} else {
			const formatDisplayRows = (args: LabelDisplayedRowsArgs) : string => {
				return intl.formatMessage({
					id: "things.rowsPerPageIndex"
				}, {
					from: args.from.toString(),
					to: args.to.toString(),
					count: args.count.toString()
				});
			}

			const adsContent = controller.activeAdControllers.map((controller) => {
				return (
					<Ad controller={controller} key={controller.controllerId}/>
				)
			});

			const labelRowsPerPage = simpleFormat(this, "things.rowsPerPage");

			content = (
				<div className={classes.paginatedContainer}>
					<div className={classes.adsContainer}>
						{adsContent}
					</div>

					<TablePagination component="div"
						labelRowsPerPage={labelRowsPerPage}
						labelDisplayedRows={formatDisplayRows}
						className={paginationClassName}
						rowsPerPage={controller.adsPerPage}
						page={controller.pageNumber}
						count={controller.totalAdCount}
						onChangeRowsPerPage={controller.onChangeAdsPerPage}
						onChangePage={controller.onChangePage}/>
				</div>
			)
		}

		return (
			<NavbarTemplate controller={navbarController}>
				{content}
			</NavbarTemplate>

		)
	}

}

export default withStyles(styles)(injectIntl(BrowsePage));
