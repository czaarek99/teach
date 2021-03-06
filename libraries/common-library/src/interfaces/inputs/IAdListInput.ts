import { AdCategory } from "../../AdCategory";

export interface IAdListInput {
	limit: number
	offset: number
	category?: AdCategory | ""
	search?: string
	startDate?: Date
	endDate?: Date
}