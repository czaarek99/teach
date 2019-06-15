export function getImageApiUrl() : string {
	const location = window.location;

	return `${location.protocol}//images.${location.hostname}:5001`
}

export function getImageUrl(fileName: string) : string {
	return `${getImageApiUrl()}/${fileName}`;
}