import React from 'react';
import Skeleton from "react-loading-skeleton";

import { Ad } from '../../organisms';
import { observer } from 'mobx-react';

import { 
	Masonry, 
	CellMeasurerCache, 
	CellMeasurer,
	MasonryCellProps 
} from "react-virtualized";

import { 
	createStyles, 
	Theme, 
	WithStyles, 
	withStyles 
} from "@material-ui/core";

import { 
	IBrowsePageController 
} from '../../../interfaces/controllers/pages/IBrowsePageController';

const styles = (theme: Theme) => createStyles({

});

interface IBrowsePageProps {
	controller: IBrowsePageController
}

@observer
export class BrowsePage extends React.Component<
	IBrowsePageProps & 
	WithStyles<typeof styles>
> {

	private cellRenderer = (props: MasonryCellProps) : React.ReactNode => {
		const controller = this.props.controller;
		const adController = controller.getAdController(props.index);

		return (
			<CellMeasurer cache={controller.cellCache} {...props}>
				<Ad controller={adController}/>
			</CellMeasurer>
		)
	} 

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		let page;

		if(controller.loading) {
			page = <Skeleton />
		} else {
			page = (
				<Masonry cellCount={controller.cellCount} 
					onCellsRendered={controller.onCellsRendered}
					autoHeight={false}
					width={570}
					height={400}
					cellMeasurerCache={controller.cellCache}
					cellRenderer={this.cellRenderer}
					cellPositioner={controller.positioner}/>
			);
		}

		return page;
	}

}

export default withStyles(styles)(BrowsePage);