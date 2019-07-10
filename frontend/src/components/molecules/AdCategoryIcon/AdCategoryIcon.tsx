import React from "react";

import ComputerIcon from "@material-ui/icons/Computer";
import CodeIcon from "@material-ui/icons/Code";
import BugIcon from "@material-ui/icons/BugReport";
import NoteIcon from "@material-ui/icons/MusicNote";
import LibraryNoteIcon from "@material-ui/icons/LibraryMusic"

import { observer } from "mobx-react";
import { AdCategory } from "common-library";

interface IAdCategoryIconProps {
	category: AdCategory
}

@observer
class AdCategoryIcon extends React.Component<IAdCategoryIconProps> {

	public render() : React.ReactNode {
		let icon;

		switch(this.props.category) {
			case AdCategory.COMPUTER_SCIENCE:
				icon = <ComputerIcon />;
			case AdCategory.PROGRAMMING:
				icon = <CodeIcon />;
			case AdCategory.HACKING:
				icon = <BugIcon />;
			case AdCategory.MUSIC:
				icon = <NoteIcon />;
			case AdCategory.MUSIC_PRODUCTION:
				icon = <LibraryNoteIcon />;
			case AdCategory.INSTRUMENTS:
				icon = <NoteIcon />;
			case AdCategory.SCIENCE:

			case AdCategory.PHYSICS:

			case AdCategory.MATH:

			case AdCategory.LANGUAGE:
		}

		return icon;
	}

}

export default AdCategoryIcon;