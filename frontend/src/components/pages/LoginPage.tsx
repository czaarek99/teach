import * as React from "react";

import { ILoginPageController } from "../../interfaces/controllers/ILoginPageController";

import { 
	TextField, 
	Paper, 
	Theme, 
	createStyles, 
	WithStyles, 
	withStyles 
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({

});

interface ILoginPageProps {
	controller: ILoginPageController
}

class LoginPage extends 
	React.Component<ILoginPageProps & WithStyles<typeof styles>> {

	public render() : React.ReactNode {
		const controller = this.props.controller;

		return (
			<Paper>
				<TextField variant="outlined" value={controller.model.email} 
					onChange={event => controller.onChange(event.target.value)}/>

				<TextField variant="outlined" value={controller.model.password}
					onChange={event => controller.onChange(event.target.value)}/>
			</Paper>
		)
	}

}

export default withStyles(styles)(LoginPage);