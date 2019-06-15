import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { Ad } from "../database/models/Ad";
import { User } from "../database/models/User";
import { IAd, IEdge, HttpError } from "common-library";
import { differenceInYears } from "date-fns";
import { throwApiError } from "server-lib";

const router = Router();

function resolveDatabaseAd(ad: Ad) : IAd {
	const user = ad.user;

	const now = new Date();

	const age = differenceInYears(now, user.birthDate);

	return {
		teacher: {
			firstName: user.firstName,
			lastName: user.lastName,
			age,
			phoneNumber: user.phoneNumber,
			email: user.email,
			city: user.address.city
		},
		id: ad.id,
		name: ad.name,
		description: ad.description,
		imageFileName: ad.imageFileName,
		publicationDate: ad.createdAt
	};
}

router.get("/list", {
	validate: {
		query: {
			limit: Joi.number().min(1).max(500).required(),
			offset: Joi.number().min(1).required(),
		}
	}
}, async (context: CustomContext) => {

	const query = context.query;

	const [ads, count] : [Ad[], number] = await Promise.all([
		Ad.findAll<Ad>({
			limit: query.limit,
			offset: query.offset,
			include: [
				User
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

	const ad = await Ad.findOne({
		where: {
			id: context.params.id
		}
	});

	if(!ad) {
		throwApiError(context, new HttpError(404));
		return;
	}

	context.body = resolveDatabaseAd(ad);
	context.status = 200;
});

export default router;