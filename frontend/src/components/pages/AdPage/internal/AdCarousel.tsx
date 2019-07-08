import React from 'react';
import SwipeableViews from "react-swipeable-views";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { IAdImage } from "common-library";
import { getImageUrl } from "../../../../util/imageAPI";
import { IAdPageController } from "../../../../interfaces/controllers/pages/IAdPageController";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	CardMedia,
	MobileStepper,
	Button
} from "@material-ui/core";

interface IAdCarouselProps {
	controller: IAdPageController
}

const styles = (theme: Theme) => createStyles({

});

@observer
class AdCarousel extends React.Component<
	IAdCarouselProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	private renderImages() : React.ReactNodeArray {

		const {
			controller
		} = this.props;

		const ad = controller.ad;
		if(ad) {
			return ad.images.map((image: IAdImage) => {
				return (
					<CardMedia component="img"
						key={image.index}
						image={getImageUrl(image.fileName)}/>
				)
			})
		}

		return [];
	}

	public render(): React.ReactNode {

		const {
			controller
		} = this.props;

		let steps = 0;

		const ad = controller.ad;
		if(ad) {
			steps = ad.images.length;
		}

		return (
			<div>
				<SwipeableViews index={controller.carouselStep}>
					{this.renderImages()}
				</SwipeableViews>
				<MobileStepper variant="dots"
					backButton={
						<Button size="small"
							onClick={() => controller.onCarouselBack()}>

							<KeyboardArrowLeft />
							<FormattedMessage id="actions.back"/>
						</Button>
					}
					nextButton={
						<Button size="small"
							onClick={() => controller.onCarouselForward()}>
							<FormattedMessage id="actions.next"/>
							<KeyboardArrowRight />
						</Button>
					}
					steps={steps}
					position="static"
					activeStep={controller.carouselStep}/>
			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(AdCarousel));