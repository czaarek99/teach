import { AdCategory } from "../../AdCategory";

export interface IEditAdInput {
	name: string
	description: string
	private: boolean
	category: AdCategory
}