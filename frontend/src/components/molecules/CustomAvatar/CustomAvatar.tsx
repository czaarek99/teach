import React from "react";

import { observer } from "mobx-react";
import { Avatar } from "@material-ui/core";
import { getImageUrl } from "../../../util/imageAPI";

interface ICustomAvatarProps {
	imageUrl?: string
	alt: React.ReactNode
}

@observer
class CustomAvatar extends React.Component<
	ICustomAvatarProps
> {

	public render() : React.ReactNode {

		const {
			imageUrl,
			alt,
		} = this.props;

		if(imageUrl) {
			return (
				<Avatar src={getImageUrl(imageUrl)}/>
			);
		} else {
			return (
				<Avatar>
					{alt}
				</Avatar>
			)
		}
	}
}

export default CustomAvatar;
