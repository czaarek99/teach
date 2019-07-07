export interface IEditAdModel {
	readonly name: string
	readonly description: string
	readonly images: Map<number, File>
}