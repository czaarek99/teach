import * as Router from "koa-router";

import { throwApiError } from "server-lib";
import { CustomContext } from "../Server";
import { v4 } from "uuid";
import { rename, unlink } from "fs-extra";
import { join } from "path";
import { config } from "../config";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { AdImage } from "../database/models/AdImage";
import { Ad } from "../database/models/Ad";

import {
	ErrorMessage,
	HttpError,
	IProfilePictureOutput,
	MAX_AD_PICTURE_COUNT,
	ISimpleIdInput,
	IAdImagesOutput,
	IAdImage
} from "common-library";

type AdImageInsert = Pick<AdImage, "adId" | "imageFileName" | "index">;

const router = new Router();

function throwInvalidImageError(context: CustomContext) : void {
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

router.patch("/ad/:id", async(context: CustomContext) => {

	const params = context.params as unknown as ISimpleIdInput;

	if(!("id" in params)) {
		throwApiError(
			context,
			new HttpError(
				400,
				"Please provide an id",
				context.state.requestId
			)
		)
	}

	const ad : Ad = await Ad.findOne({
		where: {
			id: params.id
		},
		include: [
			AdImage
		]
	});

	if(!ad) {
		throwApiError(
			context,
			new HttpError(
				404,
				ErrorMessage.AD_NOT_FOUND,
				context.state.requestId
			)
		);
	}

	const promises : Promise<any>[] = [];
	const bulkInserts : AdImageInsert[] = [];

	for(let i = 0; i < MAX_AD_PICTURE_COUNT; i++) {
		const image = context.request.files[i];

		if(image) {
			if(!image.type.startsWith("image")) {
				throwInvalidImageError(context);
				return;
			}

			const imageExtension = image.type.split("/")[1];

			if(imageExtension !== "png" && imageExtension !== "jpeg") {
				throwInvalidImageError(context);
				return;
			}

			const adImage = ad.images.find((adImage: AdImage) => {
				return adImage.index === i;
			});

			const uuid = v4();
			const newFileName = `${uuid}.${imageExtension}`;
			const newImageFullPath = join(config.userImagesPath, newFileName);

			//Remove old adimage for this index
			if(adImage) {
				const oldImageFullPath = join(config.userImagesPath, adImage.imageFileName);

				promises.push(unlink(oldImageFullPath));
				promises.push(
					adImage.update({
						imageFileName: newFileName
					})
				)
			} else {
				bulkInserts.push({
					adId: ad.id,
					index: i,
					imageFileName: newFileName
				});
			}

			promises.push(rename(image.path, newImageFullPath));
		}
	}

	promises.push(AdImage.bulkCreate(bulkInserts));
	await Promise.all(promises);

	const dbAdImages : AdImage[] = await AdImage.findAll({
		where: {
			adId: ad.id
		}
	});

	const images : IAdImage[] = dbAdImages.map((adImage: AdImage) => {
		return {
			index: adImage.index,
			fileName: adImage.imageFileName
		}
	});

	const output : IAdImagesOutput = {
		images
	};

	context.body = output;
	context.status = 200;
});

export default router;