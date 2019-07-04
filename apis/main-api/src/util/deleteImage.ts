import { join } from "path";
import { unlink } from "fs-extra";
import { config } from "../config";
import { Image } from "../database/models/Image";

export async function deleteImage(image: Image) : Promise<void> {
	const fullPath = join(config.userImagesPath, image.imageFileName);

	await Promise.all([
		unlink(fullPath),
		image.destroy()
	]);
}