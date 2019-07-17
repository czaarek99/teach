import React from "react";

import { observer } from "mobx-react";
import { Avatar } from "@material-ui/core";
import { getImageUrl } from "../../../util";

interface ICustomAvatarProps {
	className?: string
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
			className
		} = this.props;

		if(imageUrl) {
			return (
				<Avatar src={getImageUrl(imageUrl)}
					className={className}/>
			);
		} else {
			return (
				<Avatar className={className}>
					{alt}
				</Avatar>
			)
		}
	}
}

export default CustomAvatar;
