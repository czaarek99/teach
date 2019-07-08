import * as Router from "koa-router";
import * as bodyParser from "koa-body";

import { throwApiError } from "server-lib";
import { CustomContext } from "../Server";
import { v4 } from "uuid";
import { rename } from "fs-extra";
import { join } from "path";
import { config } from "../config";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { AdImage } from "../database/models/AdImage";
import { Ad } from "../database/models/Ad";
import { Joi } from "koa-joi-router";
import { AnySchema } from "joi";
import { Op } from "sequelize";

import {
	ErrorMessage,
	HttpError,
	IProfilePictureOutput,
	MAX_AD_PICTURE_COUNT,
	ISimpleIdInput,
	IAdImagesOutput,
	IAdImage,
	IAdDeleteIndexesInput
} from "common-library";
import { throwAdNotFound } from "../util/throwAdNotFound";

type AdImageInsert = Pick<AdImage, "adId" | "imageFileName" | "index">;

const router = new Router();

const AD_ID_VALIDATOR = Joi.number()
	.integer()
	.min(0)
	.required();

const AD_ID_INDEXES_VALIDATOR = Joi.array().allow(
	Joi.number()
	.integer()
	.min(0)
	.max(MAX_AD_PICTURE_COUNT)
	.required()
).required();

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

function validateSchemaManually(context: CustomContext, schema: AnySchema, value: any) : boolean {
	const result = schema.validate(value);

	if(result.error) {
		throwApiError(
			context,
			new HttpError(
				400,
				result.error.message,
				context.state.requestId,
				true
			)
		);

		return false;
	}

	return true;
}

router.use(bodyParser({
	multipart: true,
	json: true,
	parsedMethods: ["POST", "PUT", "PATCH", "DELETE"]
}));

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

	await ProfilePicture.destroy({
		where: {
			userId: context.state.session.userId
		}
	});

	context.status = 200;

});

router.delete("/ad/:id", async(context: CustomContext) => {

	const params = context.params as unknown as ISimpleIdInput;

	if(!validateSchemaManually(context, AD_ID_VALIDATOR, params.id)) {
		return;
	}

	const body = context.request.body as IAdDeleteIndexesInput;

	if(!validateSchemaManually(context, AD_ID_INDEXES_VALIDATOR, body.indexes)) {
		return;
	}

	await AdImage.destroy({
		where: {
			adId: params.id,
			index: {
				[Op.in]: body.indexes
			}
		}
	});

	context.status = 200;
});

router.patch("/ad/:id", async(context: CustomContext) => {

	const params = context.params as unknown as ISimpleIdInput;

	if(!validateSchemaManually(context, AD_ID_VALIDATOR, params.id)) {
		return;
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
		throwAdNotFound(context);
		return;
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

	//TODO: Clean up unused images

	context.body = output;
	context.status = 200;
});

export default router;