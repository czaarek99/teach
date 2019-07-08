import errors from "./errors";
import actions from "./actions";
import things from "./things";
import info from "./info";
import categories from "./categories";

export default {
	...errors,
	...actions,
	...things,
	...info,
	...categories
}