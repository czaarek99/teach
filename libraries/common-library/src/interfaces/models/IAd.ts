import { ITeacher } from "./ITeacher";
import { IAdImage } from "./IAdImage";

export interface IAd {
	teacher: ITeacher

	id: number
	name: string
	description: string
	publicationDate: Date
	images: IAdImage[]
	private: boolean
}