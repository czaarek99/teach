import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { ISettingsInput, IManySettingsInput } from "common-library";
import { UserSetting } from "../database/models/UserSetting";

interface ISettingTypes {
	[key: string]: "boolean" | "integer" | "string"
}

const router = Router();

const SETTING_TYPES : ISettingTypes = {
	showEmail: "boolean",
	showPhone: "boolean"
};

const SETTING_KEYS = Object.keys(SETTING_TYPES);

router.patch("/", {
	validate: {
		body: {
			key: Joi.string().only(SETTING_KEYS).required(),
			value: Joi.string().required()
		},
		type: "json"
	},
}, async(context: CustomContext) => {

	const input = context.request.body as ISettingsInput;

	await UserSetting.update<UserSetting>({
		value: input.value
	}, {
		where: {
			userId: context.state.session.userId
		}
	});

	context.status = 200;
});

router.patch("/many", {
	validate: {
		body: {
			changes: Joi.object().optionalKeys(SETTING_KEYS)
		},
		type: "json"
	}
}, async(context: CustomContext) => {

	const input = context.request.body as IManySettingsInput;

	const updates = [];

	for(const [key, value] of Object.entries(input.changes)) {

		updates.push(async () => {
			const type = SETTING_TYPES[key];

			let update;

			if(type === "boolean") {
				update = {
					integerValue: value ? 1 : 0
				}
			} else if(type === "string") {
				update = {
					stringValue: value
				};
			} else if(type === "integer") {
				update = {
					integerValue: value
				};
			} else {

			}

			await UserSetting.update(update, {
				where: {
					key,
					userId: context.state.session.userId
				}
			})
		});
	}

});

router.get("/all", async(context: CustomContext) => {

});

router.get("/:key", {

}, async(context: CustomContext) => {

});

export default router;