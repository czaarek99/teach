import * as Router from "koa-router";

import { join } from "path";
import { config } from "./config";
import { CustomContext } from "./Server";
import { rename, unlink } from "fs-extra";
import { v4 } from "uuid";
import { UserImage } from "./database/models/UserImage";
import { throwApiError } from "server-lib";
import { HttpError, ErrorMessage } from "../../../libraries/common-library/dist";

export const router = new Router();

export function throwInvalidImageError(context: CustomContext) : void {
	throwApiError(
		context, 
		new HttpError(
			400, 
			ErrorMessage.INVALID_IMAGE, 
			context.state.requestId
		)
	);
}

router.put("/", async (context: CustomContext) => {

	const image = context.request.files.image;

	if(!image) {
		throwInvalidImageError(context);
		return;
	}

	if(!image.type.startsWith("image")) {
		throwInvalidImageError(context);
		return;
	}

	const imageExtension = image.type.split("/")[1];

	if(imageExtension !== "png" && imageExtension !== "jpeg") {
		throwInvalidImageError(context);
		return;
	}


	const uuid = v4();
	const fileName = `${uuid}.${imageExtension}`;
	const newPath = join(config.userImagesPath, fileName);

	await rename(image.path, newPath);

	await UserImage.create<UserImage>({
		imageFileName: fileName,
		userId: context.state.session.userId
	});

	context.body = {
		fileName
	};

	context.status = 200;
});

router.delete("/:fileName", async (context: CustomContext) => {

	const fileName = context.params.fileName;

	if(!fileName) {
		throwInvalidImageError(context);
		return;
	}

	const userImage = await UserImage.findOne<UserImage>({
		where: {
			userId: context.state.session.userId,
			fileName	
		}
	});

	if(!userImage) {
		throwInvalidImageError(context);
		return;
	}

	const fullPath = join(config.userImagesPath, fileName);

	await Promise.all([
		unlink(fullPath),
		userImage.destroy()
	]);

	context.status = 200;
});