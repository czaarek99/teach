import { IEditAdModel } from "../../models/IEditAdModel";
import { ErrorState, ErrorModel } from "../../../validation/ErrorModel";
import { LoadingButtonState } from "../../../components";
import { ViewModel } from "../../ViewModel";

export interface IEditAdPageErrorState extends ErrorState {
	name: string[]
	description: string[]
	images: string[]
	category: string[]
}

export interface IEditAdPageController {
	readonly viewModel: IEditAdModel;
	readonly errorModel: ErrorModel<IEditAdPageErrorState>
	readonly saveButtonState: LoadingButtonState
	readonly pageError: string
	readonly currentImageUrl: string
	readonly isDraggingOver: boolean
	readonly loading: boolean
	readonly imageIndex: number
	readonly descriptionRows: number
	readonly showReset: boolean

	getImageUrl: (index: number) => string
	setImageIndex: (index: number) => void
	onDragEnter: () => void
	onDragLeave: () => void
	onDrop: (files: File[]) => void
	onCloseSnackbar: () => void
	onSave: () => Promise<void>
	onChange: (key: keyof IEditAdModel, value: any) => void
	onDeleteImage: (index: number) => void
	onWindowResize: () => void
}