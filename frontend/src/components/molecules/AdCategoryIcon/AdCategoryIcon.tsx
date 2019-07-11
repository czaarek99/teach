import React from "react";

import { observer } from "mobx-react";
import { AdCategory } from "common-library";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

import {
	faFlask,
	faLaptop,
	faTerminal,
	faCode,
	faMusic,
	faCompactDisc,
	faGuitar,
	faAtom,
	faSquareRootAlt,
	faLanguage,
	faQuestion
} from "@fortawesome/free-solid-svg-icons";

interface IAdCategoryIconProps {
	category: AdCategory
}

@observer
class AdCategoryIcon extends React.Component<IAdCategoryIconProps> {

	public render() : React.ReactNode {

		const {
			category
		} = this.props;

		let icon;

		switch(category) {
			case AdCategory.COMPUTER_SCIENCE:
				icon = faLaptop;
				break;
			case AdCategory.PROGRAMMING:
				icon = faCode;
				break;
			case AdCategory.HACKING:
				icon = faTerminal;
				break;
			case AdCategory.MUSIC:
				icon = faMusic;
				break;
			case AdCategory.MUSIC_PRODUCTION:
				icon = faCompactDisc;
				break;
			case AdCategory.INSTRUMENTS:
				icon = faGuitar;
				break;
			case AdCategory.SCIENCE:
				icon = faFlask;
				break;
			case AdCategory.PHYSICS:
				icon = faAtom;
				break;
			case AdCategory.MATH:
				icon = faSquareRootAlt;
				break;
			case AdCategory.LANGUAGE:
				icon = faLanguage;
				break;
			default:
				icon = faQuestion;
		}

		const title = (
			<React.Fragment>
				<FormattedMessage id="things.adCategory"/>
				<span>: </span>
				<FormattedMessage id={category}/>
			</React.Fragment>
		);

		return (
			<Tooltip placement="top"
				title={title}>

				<div>
					<FontAwesomeIcon icon={icon}/>
				</div>
			</Tooltip>
		);
	}
}

export default AdCategoryIcon;