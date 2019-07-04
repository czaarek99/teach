import { LoadingButtonState } from "../../../components";

export interface IProfilePictureController {
	readonly loading: boolean
	readonly saveButtonState: LoadingButtonState
	readonly isDraggingOver: boolean
	readonly imageUrl: string

	onUnmount: () => void
	onDragEnter: () => void
	onDragLeave: () => void
	onDrop: (acceptedFiles: File[]) => void
	onSave: () => Promise<void>
}