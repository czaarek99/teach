import { InjectedIntlProps } from "react-intl";

export function simpleFormat(component: React.Component<InjectedIntlProps>, id: string) : string {
	return component.props.intl.formatMessage({
		id
	});
}
