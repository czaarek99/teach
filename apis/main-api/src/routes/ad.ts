import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { Ad } from "../database/models/Ad";
import { User } from "../database/models/User";
import { authenticationMiddleware } from "server-lib";
import { Address } from "../database/models/Address";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";
import { UserSetting } from "../database/models/UserSetting";
import { AdImage } from "../database/models/AdImage";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { throwAdNotFound } from "../util/throwAdNotFound";
import { Op, QueryTypes } from "sequelize";

import {
	IAd,
	IEdge,
	IAdListInput,
	ISimpleIdInput,
	AD_NAME_MIN_LENGTH,
	AD_NAME_MAX_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
	ISimpleIdOutput,
	IEditAdInput,
	IAdImage,
	AdCategory,
} from "common-library";
import { Sequelize } from "sequelize-typescript";

const router = Router();

function resolveDatabaseAd(ad: Ad) : IAd {
	const user = ad.user;

	const teacher = resolveTeacher(user);

	const images : IAdImage[] = ad.images.map((dbImage: AdImage) => {
		return {
			index: dbImage.index,
			fileName: dbImage.imageFileName
		}
	});

	return {
		teacher,
		id: ad.id,
		name: ad.name,
		description: ad.description,
		publicationDate: ad.createdAt,
		private: ad.private,
		category: ad.category,
		images,
	};
}

const INCLUDES = [
	{
		model: AdImage
	},
	{
		model: User,
		include: [
			Address,
			UserSetting,
			ProfilePicture
		]
	},
];

const AD_CATEGORY_VALUES = Object.values(AdCategory);

router.get("/list", {
	validate: {
		query: {
			limit: Joi.number().min(0).max(500).required(),
			offset: Joi.number().min(0).required(),
			category: Joi.string().allow(AD_CATEGORY_VALUES).allow("").optional(),
			search: Joi.string().allow("").optional(),
			startDate: Joi.date().optional(),
			endDate: Joi.date().optional()
		}
	}
}, async (context: CustomContext) => {

	const query = context.query as IAdListInput;

	let where : any = {
		private: false
	};

	if(query.startDate || query.endDate) {
		const dateRequirements : any = {};

		if(query.startDate) {
			dateRequirements[Op.gt] = query.startDate;
		}

		if(query.endDate) {
			dateRequirements[Op.lt] = query.endDate;
		}

		where.creationDate = dateRequirements;
	}

	if(query.category) {
		where.category = query.category;
	}

	if(query.search) {
		where.name = Sequelize.where(
			Sequelize.fn("lower", Sequelize.col("name")),
			{
				[Op.like]: `%${query.search}%`
			}
		)
	}

	const [ads, count] : [Ad[], number] = await Promise.all([
		Ad.findAll<Ad>({
			where,
			limit: query.limit,
			offset: query.offset,
			include: INCLUDES
		}),
		Ad.count({
			where
		})
	]);

	const resolved = ads.map(resolveDatabaseAd);

	const edge : IEdge<IAd> = {
		totalCount: count,
		data: resolved
	}

	context.body = edge;
	context.status = 200;
});

router.get("/single/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async (context: CustomContext) => {

	const get = context.params as ISimpleIdInput;

	let userId = -1;

	if(context.state.session) {
		userId = context.state.session.userId;
	}

	const ad = await Ad.findOne({
		where: {
			id: get.id,
			[Op.or]: [
				{
					private: false
				},
				{
					userId
				}
			],
		},
		include: INCLUDES
	});

	if(!ad) {
		throwAdNotFound(context);
		return;
	}

	context.body = resolveDatabaseAd(ad);
	context.status = 200;
});

router.use(authenticationMiddleware);

router.get("/my", async(context: CustomContext) => {

	const ads : Ad[] = await Ad.findAll<Ad>({
		where: {
			userId: context.state.session.userId,
		},
		include: INCLUDES
	});

	const resolved  = ads.map(resolveDatabaseAd);

	const edge : IEdge<IAd> = {
		totalCount: ads.length,
		data: resolved
	};

	context.body = edge;
	context.status = 200;
});

router.put("/", {
	validate: {
		body: {
			name: Joi.string().min(AD_NAME_MIN_LENGTH).max(AD_NAME_MAX_LENGTH).required(),
			description: Joi.string().min(AD_DESCRIPTION_MIN_LENGTH).max(AD_DESCRIPTION_MAX_LENGTH).required(),
			private: Joi.bool().required(),
			category: Joi.string().allow(AD_CATEGORY_VALUES).required()
		},
		type: "json"
	}
}, async(context: CustomContext) => {

	const input = context.request.body as IEditAdInput;

	const ad : Ad = await Ad.create({
		name: input.name,
		description: input.description,
		private: input.private,
		userId: context.state.session.userId,
		category: input.category
	});

	const output : ISimpleIdOutput = {
		id: ad.id
	};

	context.body = output;
	context.status = 200;
});

router.patch("/:id", {
	validate: {
		body: {
			name: Joi.string().min(AD_NAME_MIN_LENGTH).max(AD_NAME_MAX_LENGTH).optional(),
			description: Joi.string().min(AD_DESCRIPTION_MIN_LENGTH).max(AD_DESCRIPTION_MAX_LENGTH).optional(),
			private: Joi.bool().optional(),
			category: Joi.string().allow(AD_CATEGORY_VALUES).optional()
		},
		params: {
			id: Joi.number().min(0).required()
		},
		type: "json"
	},
}, async(context: CustomContext) => {

	const input = context.request.body as Partial<IEditAdInput>;
	const paramsInput = context.request.params as unknown as ISimpleIdInput;

	await Ad.update(input, {
		where: {
			id: paramsInput.id
		}
	});

	context.status = 200;
});

router.delete("/:id", async(context: CustomContext) => {
	const params = context.request.params as unknown as ISimpleIdInput;

	const ad : Ad =  await Ad.findOne({
		where: {
			id: params.id,
			userId: context.state.session.userId
		},
		include: [
			AdImage
		],
	});

	if(!ad) {
		throwAdNotFound(context);
		return;
	}

	//Dont await here either
	await ad.destroy();

	context.status = 200;
});

export default router;
