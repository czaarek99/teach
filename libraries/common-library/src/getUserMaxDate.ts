import { subYears } from "date-fns";
import { USER_MIN_AGE } from "./constants/ValidationConstants";

export function getUserMaxDate() {
	return subYears(new Date(), USER_MIN_AGE);
}