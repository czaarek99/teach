import { PaletteColor, PaletteColorOptions } from "@material-ui/core/styles/createPalette";

declare module "@material-ui/core/styles/createPalette" {
	interface Palette {
		success: PaletteColor
	}	

	interface PaletteOptions {
		success: PaletteColorOptions
	}
}