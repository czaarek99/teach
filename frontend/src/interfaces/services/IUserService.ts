import { ITeacher } from "common-library";

export interface IUserService {
	getUser: (id: number) => Promise<ITeacher>
	getSelf: () => Promise<ITeacher>
}