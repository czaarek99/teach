export function getImageUrl(fileName: string) : string {
	const location = window.location;
	return `${location.protocol}//api.${location.hostname}:5000/images/${fileName}`;
}