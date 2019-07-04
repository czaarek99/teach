import * as Router from "koa-router";

import { throwApiError } from "server-lib";
import { CustomContext } from "../Server";
import { v4 } from "uuid";
import { rename } from "fs-extra";
import { join } from "path";
import { config } from "../config";
import { Image } from "../database/models/Image";
import { deleteImage } from "../util/deleteImage";

import {
	ErrorMessage,
	HttpError,
	ISimpleStringIdInput,
	MAX_IMAGE_COUNT
} from "common-library";

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

	const imageCount = await Image.count({
		where: {
			userId: context.state.session.userId
		}
	});

	if(imageCount > MAX_IMAGE_COUNT) {
		throwApiError(
			context,
			new HttpError(
				400,
				ErrorMessage.IMAGE_UPLOAD_LIMIT_REACHED,
				context.state.requestId
			)
		);

		return;
	}

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

router.delete("/:id", async (context: CustomContext) => {

	const input = context.request.params as unknown as ISimpleStringIdInput;
	const id = parseInt(input.id);

	if(Number.isNaN(id)) {
		throwInvalidImageError(context);
		return;
	}

	const userImage : Image = await Image.findOne<Image>({
		where: {
			userId: context.state.session.userId,
			id
		}
	});

	if(!userImage) {
		throwInvalidImageError(context);
		return;
	}

	await deleteImage(userImage);

	context.status = 200;
});

export default router;