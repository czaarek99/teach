import { ITeacher } from "./ITeacher";

export interface IAd {
	teacher: ITeacher

	id: number
	name: string
	description: string
	imageFileName: string
	publicationDate: Date
}