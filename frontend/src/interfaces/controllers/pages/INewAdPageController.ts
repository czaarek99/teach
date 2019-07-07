import { INewAdModel } from "../../models/INewAdModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { LoadingButtonState } from "../../../components";

export interface INewAdPageErrorState extends ErrorState {
	name: string[]
	description: string[]
}

export interface INewAdPageController {
	readonly model: INewAdModel;
	readonly errorModel: ErrorModel<INewAdPageErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly pageError: string
	readonly imageUrl: string
	readonly isDraggingOver: boolean
	readonly loading: boolean
	readonly imageIndex: number
	readonly descriptionRows: number

	getImageUrl: (index: number) => string
	setImageIndex: (index: number) => void
	onDragEnter: () => void
	onDragLeave: () => void
	onDrop: (files: File[]) => void
	onCloseSnackbar: () => void
	onSave: () => Promise<void>
	onChange: (key: keyof INewAdModel, value: any) => void
	onDeleteImage: (index: number) => void
	onWindowResize: () => void
}