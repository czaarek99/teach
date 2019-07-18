import {
	IProfilePictureOutput,
	IAdImagesOutput,
	IAdDeleteIndexesInput
} from "common-library";

export interface IImageService {
	updateProfilePic: (file: File) => Promise<IProfilePictureOutput>
	updateAdPics: (id: number, formData: FormData) => Promise<IAdImagesOutput>
	deleteAdPics: (id: number, input: IAdDeleteIndexesInput) => Promise<void>
	deleteProfilePic: () => Promise<void>
}