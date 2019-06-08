export function objectKeys<T>(object: T) : (keyof T)[] {
	return Object.keys(object) as (keyof T)[];
}