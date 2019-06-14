import * as Router from "koa-router";

import { join } from "path";
import { config } from "./config";
import { CustomContext } from "./Server";
import { rename, unlink } from "fs-extra";
import { v4 } from "uuid";
import { UserImage } from "./database/models/UserImage";

export const router = new Router();

router.put("/", async (context: CustomContext) => {

	const image = context.request.files.image;

	if(!image) {
		context.status = 400;
		return;
	}

	if(!image.type.startsWith("image")) {
		context.status = 400;
		return;
	}

	const imageExtension = image.type.split("/")[1];

	if(imageExtension !== "png" && imageExtension !== "jpeg") {
		context.status = 400;
		return;
	}


	const uuid = v4();
	const fileName = `${uuid}.${imageExtension}`;
	const newPath = join(config.userImagesPath, fileName);

	await rename(image.path, newPath);

	await UserImage.create<UserImage>({
		imageFileName: fileName,
		userId: context.state.userId 
	});

	context.body = {
		fileName
	};

	context.status = 200;
});

router.delete("/:fileName", async (context: CustomContext) => {

	const fileName = context.params.fileName;

	if(!fileName) {
		context.status = 400;
		return;
	}

	const userImage = await UserImage.findOne<UserImage>({
		where: {
			userId: context.state.userId,
			fileName	
		}
	});

	if(!userImage) {
		context.status = 404;
		return;
	}

	const fullPath = join(config.userImagesPath, fileName);

	await Promise.all([
		unlink(fullPath),
		userImage.destroy()
	]);

	context.status = 200;
});