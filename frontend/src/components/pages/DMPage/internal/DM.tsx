import React from "react";

import { Theme, createStyles, WithStyles, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { IConversation } from "common-library";
import { CustomAvatar } from "../../../molecules";
import { IDMPageController } from "../../../../interfaces";
import { observer } from "mobx-react";

const styles = (theme: Theme) => createStyles({
	root: {
		display: "flex"
	}
});

interface IDMProps {
	controller: IDMPageController
	convo: IConversation
}

@observer
class DM extends React.Component<
	IDMProps &
	WithStyles<typeof styles>
> {

	public render() : React.ReactNode {

		const {
			convo,
			controller,
			classes
		} = this.props;

		const onlyOtherMember = convo.members[0];

		let lastMessage;
		if(convo.messages.length > 0) {
			lastMessage = convo.messages[0].content;
		}

		return (
			<div className={classes.root}
				onClick={() => controller.selectConvo(convo)}>

				<CustomAvatar alt={onlyOtherMember.firstName[0]}
					imageUrl={onlyOtherMember.avatarFileName}/>
				<div>
					<Typography>
						{onlyOtherMember.firstName} {onlyOtherMember.lastName}
					</Typography>
					<Typography>
						{lastMessage}
					</Typography>
				</div>
			</div>
		);
	}

}

export default withStyles(styles)(DM);