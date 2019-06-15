import React from 'react';
import Skeleton from "react-loading-skeleton";

import { Ad } from '../../organisms';

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

const cache = new CellMeasurerCache({
});

export class BrowsePage extends React.Component<
	IBrowsePageProps & 
	WithStyles<typeof styles>
> {

	private cellRenderer(props: MasonryCellProps) : React.ReactNode {
		const controller = this.props.controller.getAdController(props.index);

		return (
			<CellMeasurer cache={cache} {...props}>
				<Ad controller={controller}/>
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
					autoHeight={false}
					width={600}
					height={1000}
					cellMeasurerCache={cache}
					cellRenderer={this.cellRenderer}
					cellPositioner={controller.positioner}/>
			);
		}

		return page;
	}

}

export default withStyles(styles)(BrowsePage);