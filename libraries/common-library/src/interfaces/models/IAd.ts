import { ITeacher } from "./ITeacher";
import { IAdImage } from "./IAdImage";
import { AdCategory } from "../../AdCategory";

export interface IAd {
	teacher: ITeacher

	id: number
	name: string
	description: string
	publicationDate: Date
	images: IAdImage[]
	private: boolean
	category: AdCategory
}