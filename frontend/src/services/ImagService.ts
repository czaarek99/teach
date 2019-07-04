import { IImageService } from "../interfaces/services/IImageService";
import { BaseService } from "./BaseService";
import { ISimpleIdOutput } from "common-library";

export class ImageService extends BaseService implements IImageService  {

	constructor() {
		super("/image");
	}

	public async uploadImage(file: File) : Promise<number> {
		const formData = new FormData();
		formData.append("image", file);

		const response = await this.axios.put<ISimpleIdOutput>("/", formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		});

		return response.data.id;
	}

	public async deleteImage(id: number) : Promise<void> {
		await this.axios.delete(`/${id}`);
	}

}