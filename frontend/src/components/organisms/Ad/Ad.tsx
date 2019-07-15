import React from "react";
import Skeleton from "react-loading-skeleton";

import { injectIntl, InjectedIntlProps } from "react-intl";
import { IAdController } from "../../../interfaces/controllers/IAdController";
import { observer } from "mobx-react";
import { AdCategoryIcon, CustomAvatar } from "../../molecules";

import {
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	Typography ,
	createStyles,
	Theme,
	withStyles,
	WithStyles,
} from "@material-ui/core";

/*

width: 2000px
height: 1000px
aspect ratio: 2:1

*/

const MAX_DESCRIPTION_LINES = 8;
const LINE_HEIGHT = "1.5em";

const MEDIUM_BREAKPOINT = "@media screen and (min-width: 400px)";
const LARGE_BREAKPOINT = "@media screen and (min-width: 560px)";

const styles = (theme: Theme) => createStyles({

	root: {
		cursor: "pointer",
		padding: 10,

		width: 300,

		[MEDIUM_BREAKPOINT]: {
			width: 380
		},

		[LARGE_BREAKPOINT]: {
			width: 460
		}
	},

	image: {
		height: 150,
		objectFit: "contain",

		[MEDIUM_BREAKPOINT]: {
			height: 190
		},

		[LARGE_BREAKPOINT]: {
			height: 230
		}
	},

	card: {
		boxShadow: theme.shadows[1],
		transition: "box-shadow 1s",

		"&:hover": {
			boxShadow: theme.shadows[20]
		}
	},

	description: {
		lineHeight: LINE_HEIGHT,
		height: `calc(${LINE_HEIGHT} * ${MAX_DESCRIPTION_LINES})`,
		lineClamp: MAX_DESCRIPTION_LINES,
		overflow: "hidden",
		textOverflow: "ellipsis",
	},

	adIconContainer: {
		padding: 16,
		fontSize: 20
	}
});

interface IAdProps {
	controller: IAdController
}


@observer
class Ad extends React.Component<
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

		const ad = controller.ad;

		let subHeader;
		let description;
		let avatar;
		let image;
		let name;
		let adIcon;

		if(ad === null) {
			name = (
				<Skeleton />
			);

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
				<div className={classes.image}>
					<Skeleton height="100%" />
				</div>
			);
		} else {
			const date = intl.formatDate(ad.publicationDate, {
				month: "long",
				day: "numeric",
				year: "2-digit"
			});

			subHeader = intl.formatMessage({
				id: "info.published",
			}, {
				date
			});

			name = ad.name;
			description = ad.description;

			image = (
				<CardMedia component="img"
					image={controller.mainImage}
					className={classes.image}/>
			);

			adIcon = (
				<div className={classes.adIconContainer}>
					<AdCategoryIcon category={ad.category}/>
				</div>
			);

			avatar = (
				<CustomAvatar imageUrl={ad.teacher.avatarFileName}
					alt={ad.teacher.firstName[0]}/>
			);
		}

		return (
			<div className={classes.root}
				onClick={() => controller.onClick()}>
				<Card className={classes.card}>
					<CardHeader title={name}
						action={adIcon}
						subheader={subHeader}
						avatar={avatar}
					/>

					{image}

					<CardContent>
						<Typography className={classes.description}>
							{description}
						</Typography>
					</CardContent>

				</Card>
			</div>
		)
	}
}

export default withStyles(styles)(injectIntl(Ad));
