import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { Ad } from "../database/models/Ad";
import { User } from "../database/models/User";
import { throwApiError, authenticationMiddleware } from "server-lib";
import { Address } from "../database/models/Address";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";
import { UserSetting } from "../database/models/UserSetting";
import { AdImage } from "../database/models/AdImage";
import { ProfilePicture } from "../database/models/ProfilePicture";

import {
	IAd,
	IEdge,
	HttpError,
	IAdListInput,
	ISimpleIdInput,
	AD_NAME_MIN_LENGTH,
	AD_NAME_MAX_LENGTH,
	AD_DESCRIPTION_MIN_LENGTH,
	AD_DESCRIPTION_MAX_LENGTH,
	ISimpleIdOutput,
	IEditAdInput,
	IAdImage
} from "common-library";

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
			include: INCLUDES
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

router.get("/single/:id", {
	validate: {
		params: {
			id: Joi.number().min(0).required()
		}
	}
}, async (context: CustomContext) => {

	const get = context.params as ISimpleIdInput;

	const ad = await Ad.findOne({
		where: {
			id: get.id
		},
		include: INCLUDES
	});

	if(!ad) {
		throwApiError(context, new HttpError(404));
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
			description: Joi.string().min(AD_DESCRIPTION_MIN_LENGTH).max(AD_DESCRIPTION_MAX_LENGTH).required()
		},
		type: "json"
	}
}, async(context: CustomContext) => {

	const input = context.request.body as IEditAdInput;

	const ad : Ad = await Ad.create({
		name: input.name,
		description: input.description,
		userId: context.state.session.userId
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
			description: Joi.string().min(AD_DESCRIPTION_MIN_LENGTH).max(AD_DESCRIPTION_MAX_LENGTH).optional()
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

export default router;
