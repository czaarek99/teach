import { IProfilePictureOutput } from "common-library";

export interface IImageService {
	updateProfilePic: (file: File) => Promise<IProfilePictureOutput>
	deleteProfilePic: () => Promise<void>
}