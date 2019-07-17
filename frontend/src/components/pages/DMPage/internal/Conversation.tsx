import React from "react";

import { Theme, createStyles, WithStyles, withStyles } from "@material-ui/core";
import { observer } from "mobx-react";
import { InjectedIntlProps, injectIntl } from "react-intl";

import {
	IConversationController
} from "../../../../interfaces/controllers/IConversationController";
import DMEditor from "./DMEditor";

const styles = (theme: Theme) => createStyles({

	root: {
		display: "flex",
		flexDirection: "column",
		height: "100%"
	},

});

interface IConversationProps {
	controller: IConversationController
}

@observer
class Conversation extends React.Component<
	IConversationProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	public render() : React.ReactNode {

		const {
			classes,
			controller
		} = this.props;

		return (
			<div className={classes.root}>
				<DMEditor value={controller.model.message}
					onChange={value => controller.onChange("message", value)}/>
			</div>
		)
	}

}

export default withStyles(styles)(injectIntl(Conversation));