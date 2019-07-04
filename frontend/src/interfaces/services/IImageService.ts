export interface IImageService {
	uploadImage: (file: File) => Promise<number>
	deleteImage: (id: number) => Promise<void>
}