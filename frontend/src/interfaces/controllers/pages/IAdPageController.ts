import { IAd } from "common-library";

export interface IAdPageController {
	readonly ad: IAd | null;
	readonly errorMessage: string;

	closeSnackbar: () => void
	goBackToBrowse: () => void
}