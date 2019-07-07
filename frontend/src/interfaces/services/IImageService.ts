import { IProfilePictureOutput, IAdImagesOutput } from "common-library";

export interface IImageService {
	updateProfilePic: (file: File) => Promise<IProfilePictureOutput>
	updateAdPics: (id: number, formData: FormData) => Promise<IAdImagesOutput>
	deleteProfilePic: () => Promise<void>
}