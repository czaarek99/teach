import React from 'react';
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import { Ad } from '../../organisms';

const styles = (theme: Theme) => createStyles({

});

const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

export class BrowsePage extends React.Component<WithStyles<typeof styles>> {

	public render() : React.ReactNode {
		return (
			<Ad name ="Test ad" 
				publicationDate={new Date()}
				userImageFileName="avatar.png" 
				description={description}
				adImageFileName="ad.png"/>	
		)
	}

}

export default withStyles(styles)(BrowsePage);