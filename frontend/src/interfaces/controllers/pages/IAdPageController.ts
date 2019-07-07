import { IAd } from "common-library";

export interface IAdPageController {
	readonly ad: IAd | null;
	readonly errorMessage: string;
	readonly carouselStep: number

	onCarouselBack: () => void
	onCarouselForward: () => void
	closeSnackbar: () => void
	goBackToBrowse: () => void
}