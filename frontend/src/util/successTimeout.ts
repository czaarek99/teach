export function successTimeout(func: () => any) : number {
	return window.setTimeout(func, 3000);
}