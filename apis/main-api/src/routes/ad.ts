import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { Ad } from "../database/models/Ad";
import { User } from "../database/models/User";
import { throwApiError } from "server-lib";
import { Image } from "../database/models/Image";
import { Address } from "../database/models/Address";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";

import {
	IAd,
	IEdge,
	HttpError,
	IAdListInput,
	ISimpleGetInput,
} from "common-library";
import { UserSetting } from "../database/models/UserSetting";

const router = Router();

function resolveDatabaseAd(ad: Ad) : IAd {
	const user = ad.user;

	const teacher = resolveTeacher(user);

	return {
		teacher,
		id: ad.id,
		name: ad.name,
		description: ad.description,
		//imageFileName: ad.mainImage.imageFileName,
		imageFileName: "ad.png",
		publicationDate: ad.createdAt
	};
}

router.get("/list", {
	validate: {
		query: {
			limit: Joi.number().min(0).max(500).required(),
			offset: Joi.number().min(0).required(),
		}
	}
}, async (context: CustomContext) => {

	const query = context.query as IAdListInput;

	const [ads, count] : [Ad[], number] = await Promise.all([
		Ad.findAll<Ad>({
			limit: query.limit,
			offset: query.offset,
			include: [
				{
					model: Image
				},
				{
					model: User,
					include: [
						Address,
						UserSetting
					]
				},
				{
					model: Image
				}
			]
		}),
		Ad.count()
	]);

	const resolved = ads.map(resolveDatabaseAd);

	const edge : IEdge<IAd> = {
		totalCount: count,
		data: resolved
	}

	context.body = edge;
	context.status = 200;
});

router.get("/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async (context: CustomContext) => {

	const get = context.params as ISimpleGetInput;

	const ad = await Ad.findOne({
		where: {
			id: get.id
		},
		include: [
			{
				model: Image
			},
			{
				model: User,
				include: [
					Address,
					UserSetting
				]
			},
			{
				model: Image
			}
		]
	});

	if(!ad) {
		throwApiError(context, new HttpError(404));
		return;
	}

	context.body = resolveDatabaseAd(ad);
	context.status = 200;
});

export default router;
