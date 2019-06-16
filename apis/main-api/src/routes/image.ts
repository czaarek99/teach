import * as Router from "koa-router";
import { throwApiError } from "server-lib";
import { ErrorMessage, HttpError } from "common-library";
import { CustomContext } from "../Server";
import { v4 } from "uuid";
import { rename, unlink } from "fs-extra";
import { join } from "path";
import { config } from "../config";
import { Image } from "../database/models/Image";

const router = new Router();

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

	const [dbImage] : [Image, void] = await Promise.all([
		Image.create<Image>({
			imageFileName: fileName,
			userId: context.state.session.userId
		}),
		rename(image.path, newPath),
	]);

	context.body = {
		id: dbImage.id
	};

	context.status = 200;
});

router.delete("/:fileName", async (context: CustomContext) => {

	const fileName = context.params.fileName;

	if(!fileName) {
		throwInvalidImageError(context);
		return;
	}

	const userImage = await Image.findOne<Image>({
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