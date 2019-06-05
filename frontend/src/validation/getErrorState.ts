import { ErrorState, ErrorModel } from "./ErrorModel";
import { InjectedIntl, MessageValue } from "react-intl";

interface IErrorProps {
	helperText?: string
	error?: true
}

interface ITranslationValues {
	[key: string]: MessageValue
}

export function getTextFieldErrorState<T extends ErrorState>(
	intl: InjectedIntl,
	errorModel: ErrorModel<T>,
	key: keyof T,
	values?: ITranslationValues
) : IErrorProps {

	const error = errorModel.getFirstKeyError(key);

	if(error !== null) {
		const translatedError = intl.formatMessage({
			id: error,
		}, values ? values : {});

		return {
			helperText: translatedError,
			error: true
		};
	}

	return {};
}