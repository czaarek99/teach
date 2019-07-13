export function objectToParams(object: object) : string {
	const params = new URLSearchParams();

	for(const [key, value] of Object.entries(object)) {
		if(value !== undefined && value !== null) {
			params.set(key, value);
		}
	}

	return params.toString();
}