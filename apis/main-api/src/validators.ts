import { Joi } from "koa-joi-router";
import { addDays } from "date-fns";

import {
	FIRST_NAME_MIN_LENGTH,
	FIRST_NAME_MAX_LENGTH,
	LAST_NAME_MIN_LENGTH,
	LAST_NAME_MAX_LENGTH,
	getUserMaxDate,
	PHONE_NUMBER_MAX_LENGTH,
	EMAIL_MIN_LENGTH,
	EMAIL_MAX_LENGTH,
	PASSWORD_MIN_LENGTH,
	PASSWORD_MAX_LENGTH,
	STREET_MIN_LENGTH,
	STREET_MAX_LENGTH,
	ZIP_CODE_MAX_LENGTH,
	ZIP_CODE_MIN_LENGTH,
	CITY_MIN_LENGTH,
	CITY_MAX_LENGTH,
	COUNTRY_CODE_LENGTH,
	STATE_MAX_LENGTH
} from "common-library";

export const FIRST_NAME_VALIDATOR = Joi.string()
	.min(FIRST_NAME_MIN_LENGTH)
	.max(FIRST_NAME_MAX_LENGTH)
	.required();

export const LAST_NAME_VALIDATOR = Joi.string()
	.min(LAST_NAME_MIN_LENGTH)
	.max(LAST_NAME_MAX_LENGTH)
	.required();

export const BIRTH_DATE_VALIDATOR = Joi.date()
	.max(addDays(getUserMaxDate(), 3))
	.required();

export const PHONE_NUMBER_VALIDATOR = Joi.string()
	.max(PHONE_NUMBER_MAX_LENGTH)
	.optional();

export const SIMPLE_EMAIL_VALIDATOR = Joi.string()
	.min(EMAIL_MIN_LENGTH)
	.max(EMAIL_MAX_LENGTH)
	.required();

export const PASSWORD_VALIDATOR = Joi.string()
	.min(PASSWORD_MIN_LENGTH)
	.max(PASSWORD_MAX_LENGTH)
	.required();

export const ADDRESS_VALIDATOR = Joi.object({
	street: Joi.string()
		.min(STREET_MIN_LENGTH)
		.max(STREET_MAX_LENGTH)
		.required(),
	zipCode: Joi.string()
		.min(ZIP_CODE_MIN_LENGTH)
		.max(ZIP_CODE_MAX_LENGTH)
		.required(),
	city: Joi.string()
		.min(CITY_MIN_LENGTH)
		.max(CITY_MAX_LENGTH)
		.required(),
	countryCode: Joi.string()
		.length(COUNTRY_CODE_LENGTH)
		.required(),
	state: Joi.string()
		.max(STATE_MAX_LENGTH)
		.allow("")
		.optional()
}).requiredKeys("street", "zipCode", "city", "countryCode").optionalKeys("state")

