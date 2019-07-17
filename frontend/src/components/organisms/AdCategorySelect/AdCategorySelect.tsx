import React from 'react';

import { observer } from "mobx-react";
import { InjectedIntlProps, FormattedMessage, injectIntl } from "react-intl";
import { CATEGORY_MAP, IAdCategoryMapping, AdCategory } from "common-library";
import { simpleFormat } from "../../../util";
import { CustomNativeSelect } from "../CustomNativeSelect";

import {
	Theme,
	createStyles,
	WithStyles,
	withStyles
} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
	optionGroup: {
		fontWeight: "bold",
		fontStyle: "italic"
	},

	optionChild: {
		paddingLeft: 15
	}
});

interface IAdCategorySelectProps {
	value?: AdCategory | ""
	required?: boolean
	onChange: (category: AdCategory) => void
	errorMessage?: string | null
	className?: string
	disabled?: boolean
}

@observer
class AdCategorySelect extends React.Component<
	IAdCategorySelectProps &
	WithStyles<typeof styles> &
	InjectedIntlProps
> {

	private renderCategoryOption(category: AdCategory, subCatgory: boolean) : React.ReactNode {

		const {
			classes,
		} = this.props;

		const optionClass = subCatgory ? classes.optionChild : classes.optionGroup;

		const categoryName = simpleFormat(this, category);

		return (
			<option value={category}
				key={category}
				className={optionClass}>

				{categoryName}
			</option>
		)
	}

	public render() : React.ReactNode {

		const {
			value,
			className,
			onChange,
			errorMessage,
			required,
			disabled
		} = this.props;

		const options : React.ReactNodeArray = CATEGORY_MAP.map((mapping: IAdCategoryMapping) => {
			return (
				<React.Fragment key={mapping.parent}>
					{this.renderCategoryOption(mapping.parent, false)}
					{
						mapping.children && mapping.children.map((category: AdCategory) => {
							return (
								this.renderCategoryOption(category, true)
							)
						})
					}
				</React.Fragment>
			);
		});

		return (
			<CustomNativeSelect value={value}
				required={required}
				className={className}
				disabled={disabled}
				errorMessage={errorMessage}
				label={
					<FormattedMessage id="things.adCategory"/>
				}
				onChange={(value: string) => onChange(value as AdCategory)}
			>

				<option value="">
					{ }
				</option>

				{options}

			</CustomNativeSelect>
		);
	}
}

export default withStyles(styles)(injectIntl(AdCategorySelect));