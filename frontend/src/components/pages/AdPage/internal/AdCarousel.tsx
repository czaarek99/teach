import React from 'react';
import SwipeableViews from "react-swipeable-views";

import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl, FormattedMessage } from "react-intl";
import { IAdImage } from "common-library";
import { getImageUrl } from "../../../../util/imageAPI";
import { IAdPageController } from "../../../../interfaces/controllers/pages/IAdPageController";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles,
	CardMedia,
	MobileStepper,
	Button
} from "@material-ui/core";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

interface IAdCarouselProps {
	controller: IAdPageController
	imageClassName: string
}

const styles = (theme: Theme) => createStyles({
	arrowIcon: {
		margin: 5,
		fontSize: 18
	}
});

@observer
class AdCarousel extends React.Component<
	IAdCarouselProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	private renderImages() : React.ReactNodeArray {

		const {
			controller,
			imageClassName
		} = this.props;

		const ad = controller.ad;
		if(ad) {
			return ad.images.map((image: IAdImage) => {
				return (
					<CardMedia component="img"
						className={imageClassName}
						key={image.index}
						image={getImageUrl(image.fileName)}/>
				)
			})
		}

		return [];
	}

	public render(): React.ReactNode {

		const {
			controller,
			classes
		} = this.props;

		let steps = 0;

		const ad = controller.ad;
		if(ad) {
			steps = ad.images.length;
		}

		return (
			<div>
				<SwipeableViews index={controller.carouselStep}
					enableMouseEvents={true}>

					{this.renderImages()}
				</SwipeableViews>
				<MobileStepper variant="dots"
					backButton={
						<Button size="small"
							disabled={!controller.carouselCanGoBack}
							onClick={() => controller.onCarouselBack()}>

							<FontAwesomeIcon icon={faAngleLeft}
								className={classes.arrowIcon}/>
							<FormattedMessage id="actions.back"/>
						</Button>
					}
					nextButton={
						<Button size="small"
							disabled={!controller.carouselCanGoNext}
							onClick={() => controller.onCarouselForward()}>

							<FormattedMessage id="actions.next"/>
							<FontAwesomeIcon icon={faAngleRight}
								className={classes.arrowIcon}/>
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