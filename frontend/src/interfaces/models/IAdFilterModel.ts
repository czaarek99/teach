import { AdCategory } from "common-library";

export interface IAdFilterModel {
	readonly category: AdCategory | ""
	readonly startPublishDate?: Date
	readonly endPublishDate?: Date
	readonly searchText: string
}