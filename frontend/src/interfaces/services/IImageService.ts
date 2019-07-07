import { IProfilePictureOutput, IAdImagesOutput } from "common-library";

export interface IImageService {
	updateProfilePic: (file: File) => Promise<IProfilePictureOutput>
	updateAdPics: (formData: FormData) => Promise<IAdImagesOutput>
	deleteProfilePic: () => Promise<void>
}