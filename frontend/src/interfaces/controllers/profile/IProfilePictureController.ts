import { LoadingButtonState } from "../../../components";

export interface IProfilePictureController {
	readonly loading: boolean
	readonly saveButtonState: LoadingButtonState
	readonly deleteButtonState: LoadingButtonState
	readonly isDraggingOver: boolean
	readonly imageUrl: string
	readonly showDelete: boolean

	onUnmount: () => void
	onDragEnter: () => void
	onDragLeave: () => void
	onDrop: (file: File) => void
	onSave: () => Promise<void>
	onDelete: () => Promise<void>
}