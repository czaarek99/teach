import React from "react";
import Truncate from "react-truncate";
import Skeleton from "react-loading-skeleton";

import { injectIntl, InjectedIntlProps } from "react-intl";
import { IAdController } from "../../../interfaces/controllers/IAdController";
import { getImageUrl } from "../../../util/imageAPI";

import { 
	Card, 
	CardHeader, 
	Avatar, 
	CardMedia, 
	CardContent, 
	Typography ,
	createStyles,
	Theme,
	withStyles,
	WithStyles
} from "@material-ui/core";

export const AD_MAX_WIDTH = 500;
export const ESTIMATED_AD_HEIGHT = 350;

const IMAGE_HEIGHT = 250;
const MAX_DESCRIPTION_LINES = 8;

const styles = (theme: Theme) => createStyles({

	root: {
		margin: 10,
		maxWidth: AD_MAX_WIDTH
	},

	image: {
		height: IMAGE_HEIGHT
	},
});

interface IAdProps {
	controller: IAdController
}


export class Ad extends React.Component<
	IAdProps & 
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			controller,
			classes,
			intl,
		} = this.props;

		const model = controller.model;

		let subHeader;
		let description;
		let avatar;
		let image;

		if(model === null) {
			subHeader = (
				<Skeleton />
			);

			description = (
				<Skeleton count={MAX_DESCRIPTION_LINES} />
			);

			avatar = (
				<Skeleton circle={true} 
					height={30} 
					width={30}/>
			);

			image = (
				<Skeleton height={IMAGE_HEIGHT} />
			);
		} else {
			const date = intl.formatDate(model.publicationDate, {
				month: "long",	
				day: "numeric",
				year: "2-digit"
			});

			subHeader = intl.formatMessage({
				id: "info.published",
			}, {
				date
			});

			description = (
				<Truncate lines={8} 
					trimWhitespace={true}>

					{model.description}
				</Truncate>
			);

			avatar = (
				<Avatar src={getImageUrl(model.teacher.avatarFileName)}/>
			);

			image = (
				<CardMedia image={getImageUrl(model.imageFileName)} 
					className={classes.image}/>
			);
		}

		return (
			<Card className={classes.root}>
				<CardHeader title={name}
					subheader={subHeader}
					avatar={avatar}
				/>

				{image}

				<CardContent>
					<Typography>
						{description}
					</Typography>
				</CardContent>
			</Card>
		)
	}
}

export default withStyles(styles)(injectIntl(Ad));