import * as Router from "koa-router";

import { join } from "path";
import { config } from "./config";
import { CustomContext } from "./Server";
import { pathExists, rename } from "fs-extra";
import { v4 } from "uuid";
import { UserImage } from "./database/models/UserImage";

const router = new Router();

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
		userId: 
	})

	context.body = {
		fileName
	};

	context.status = 200;
});

router.delete("/:fileName", async (context: CustomContext) => {

})
