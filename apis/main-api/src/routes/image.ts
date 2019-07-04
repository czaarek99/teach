import * as Router from "koa-router";

import { throwApiError } from "server-lib";
import { CustomContext } from "../Server";
import { v4 } from "uuid";
import { rename, unlink } from "fs-extra";
import { join } from "path";
import { config } from "../config";
import { ProfilePicture } from "../database/models/ProfilePicture";

import {
	ErrorMessage,
	HttpError,
	IProfilePictureOutput
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

router.patch("/profile", async (context: CustomContext) => {

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

	const oldPic : ProfilePicture = await ProfilePicture.findOne<ProfilePicture>({
		where: {
			userId: context.state.session.userId
		}
	});

	if(oldPic) {
		await oldPic.destroy();
	}


	const uuid = v4();
	const fileName = `${uuid}.${imageExtension}`;
	const newPath = join(config.userImagesPath, fileName);

	const [dbImage] : [ProfilePicture, void] = await Promise.all([
		ProfilePicture.create<ProfilePicture>({
			imageFileName: fileName,
			userId: context.state.session.userId
		}),
		rename(image.path, newPath),
	]);

	const output : IProfilePictureOutput = {
		fileName: dbImage.imageFileName
	};

	context.body = output;
	context.status = 200;
});

router.delete("/profile", async (context: CustomContext) => {

	const picture : ProfilePicture = await ProfilePicture.findOne<ProfilePicture>({
		where: {
			userId: context.state.session.userId
		}
	});

	const fullPath = join(config.userImagesPath, picture.imageFileName);

	await Promise.all([
		unlink(fullPath),
		picture.destroy()
	]);

	context.status = 200;

});


router.put("/ad", async(context: CustomContext) => {

	context.status = 501;

});

export default router;