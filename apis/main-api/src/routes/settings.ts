import * as Router from "koa-joi-router";

import { Joi } from "koa-joi-router";
import { CustomContext } from "../Server";
import { UserSetting } from "../database/models/UserSetting";

import {
	IManySettingsInput,
	SETTING_MAX_LENGTH,
	SettingValue,
	ISetting
} from "common-library";

interface ISettings {
	[key: string]: "boolean" | "integer" | "string"
}

const router = Router();

const SETTING_TYPES : ISettings = {
	showEmail: "boolean",
	showPhone: "boolean"
};

const SETTINGS_INPUT_VALIDATOR = Joi.object({
	key: Joi.string().only(Object.keys(SETTING_TYPES)).required(),
	value: Joi.alternatives().try(
		Joi.string().max(SETTING_MAX_LENGTH),
		Joi.number().integer(),
		Joi.boolean(),
	).required().allow(null)
});

function getDatabaseKey(key: string) : string {
	const type = SETTING_TYPES[key];

	if(type === "boolean" || type === "integer") {
		return "integerValue";
	} else {
		return "stringValue";
	}
}

function getUpdate(key: string, value: SettingValue) {

	const type = SETTING_TYPES[key];
	const databaseKey = getDatabaseKey(key);

	if(type === "boolean") {
		return {
			integerValue: value ? 1 : 0
		};
	} else {
		return {
			[databaseKey]: value
		}
	}

}

router.patch("/", {
	validate: {
		body: SETTINGS_INPUT_VALIDATOR,
		type: "json"
	},
}, async(context: CustomContext) => {

	const input = context.request.body as ISetting;
	const update = getUpdate(input.key, input.value);

	await UserSetting.update<UserSetting>(update, {
		where: {
			userId: context.state.session.userId
		}
	});

	context.status = 200;
});

router.patch("/many", {
	validate: {
		body: {
			changes: Joi.array().items(SETTINGS_INPUT_VALIDATOR)
		},
		type: "json"
	}
}, async(context: CustomContext) => {

	const input = context.request.body as IManySettingsInput;

	const promises : Promise<any>[] = [];

	for(const change of input.changes) {
		const update = getUpdate(change.key, change.value);

		promises.push(UserSetting.update(update, {
			where: {
				key: change.key,
				userId: context.state.session.userId
			}
		}));
	}

	await Promise.all(promises);

	context.status = 200;
});

router.get("/", async(context: CustomContext) => {
	const dbSettings : UserSetting[] = await UserSetting.findAll<UserSetting>({
		where: {
			userId: context.state.session.userId
		}
	});

	const settings = dbSettings.map((userSetting) => {
		const databaseKey = getDatabaseKey(userSetting.key);

		return {
			key: userSetting.key,
			value: userSetting[databaseKey]
		}
	});

	context.body = settings;
	context.status = 200;
});

export default router;