import * as React from "react";

import Truncate from "react-truncate";

import { injectIntl, InjectedIntlProps } from "react-intl";
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

const styles = (theme: Theme) => createStyles({

	root: {
		margin: 10,
		maxWidth: 500
	},

	image: {
		height: 250
	},
});

interface IAdProps {
	userImageFileName: string
	adImageFileName: string
	name: string
	description: string
	publicationDate: Date
}

export class Ad extends React.Component<
	IAdProps & 
	InjectedIntlProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			publicationDate,
			userImageFileName,
			adImageFileName,
			name,
			description,
			classes,
			intl,
		} = this.props;

		const date = intl.formatDate(publicationDate, {
			month: "long",	
			day: "numeric",
			year: "2-digit"
		});

		const publishedLabel = intl.formatMessage({
			id: "info.published",
		}, {
			date
		});

		return (
			<Card className={classes.root}>
				<CardHeader title={name}
					subheader={publishedLabel}
					avatar={
						<Avatar src={getImageUrl(userImageFileName)}/>
					}
				/>

				<CardMedia image={getImageUrl(adImageFileName)} 
					className={classes.image}/>

				<CardContent>
					<Typography>
						<Truncate lines={8} 
							trimWhitespace={true}>

							{description}
						</Truncate>
					</Typography>
				</CardContent>
			</Card>
		)
	}
}

export default withStyles(styles)(injectIntl(Ad));