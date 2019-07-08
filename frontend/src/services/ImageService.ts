import { IImageService } from "../interfaces/services/IImageService";
import { BaseService } from "./BaseService";
import { IProfilePictureOutput, IAdImagesOutput, IAdDeleteIndexesInput } from "common-library";

export class ImageService extends BaseService implements IImageService  {

	constructor() {
		super("/image");
	}

	public async deleteProfilePic() : Promise<void> {
		await this.axios.delete("/profile");
	}

	public async updateProfilePic(file: File) : Promise<IProfilePictureOutput> {
		const formData = new FormData();
		formData.append("image", file);

		const response = await this.axios.patch<IProfilePictureOutput>("/profile", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		return response.data;
	}

	public async deleteImage(id: number) : Promise<void> {
		await this.axios.delete(`/${id}`);
	}

	public async updateAdPics(id: number, formData: FormData) : Promise<IAdImagesOutput> {
		const response = await this.axios.patch<IAdImagesOutput>(`/ad/${id}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		return response.data;
	}

	public async deleteAdPics(id: number, input: IAdDeleteIndexesInput) : Promise<void> {
		await this.axios.delete(`/ad/${id}`, {
			data: input
		});
	}

}