import { observable, action, computed } from "mobx";
import { IProfilePictureController } from "../../interfaces";
import { RootStore } from "../../stores";
import { ProfilePageController } from "../pages";
import { LoadingButtonState } from "../../components";
import { getImageUrl, successTimeout } from "../../util";

export class ProfilePictureController implements IProfilePictureController {

	@observable private readonly rootStore: RootStore;
	private readonly parent: ProfilePageController;

	private imageFile?: File;
	private successTimeout?: number;

	@observable public loading = false;
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public deleteButtonState : LoadingButtonState = "default";
	@observable public isDraggingOver = false;
	@observable public imageUrl = "";

	constructor(
		rootStore: RootStore,
		parent: ProfilePageController,
	) {
		this.rootStore = rootStore;
		this.parent = parent;
	}

	public onUnmount() : void {
		if(this.imageUrl) {
			URL.revokeObjectURL(this.imageUrl);
		}
	}

	@computed
	public get showDelete() : boolean {
		return this.imageUrl ? true : false;
	}

	@action
	public async load() : Promise<void> {
		const user = this.rootStore.userCache.user;
		if(user && user.avatarFileName) {
			this.imageUrl = getImageUrl(user.avatarFileName);
		}
	}

	@action
	public onDrop = (files: File[]) : void => {
		this.isDraggingOver = false;
		const image = files[0];

		this.imageFile = image;
		this.imageUrl = URL.createObjectURL(image);
	}

	@action
	public async onSave() : Promise<void> {
		if(this.imageFile) {
			clearTimeout(this.successTimeout);

			this.loading = true;
			this.saveButtonState = "loading";
			this.deleteButtonState = "disabled";

			try {
				const output = await this.rootStore.services.imageService.updateProfilePic(
					this.imageFile
				);

				this.rootStore.userCache.updateProfilePic(output.fileName);
				this.saveButtonState = "success";

				this.successTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				});
			} catch(error) {
				this.parent.serverError(error);

				this.saveButtonState = "error";
			}

			this.loading = false;
			this.deleteButtonState = "default";
		}
	}

	@action
	public async onDelete() : Promise<void> {
		this.loading = true;
		this.saveButtonState = "disabled";

		try {
			await this.rootStore.services.imageService.deleteProfilePic();
			this.rootStore.userCache.deleteProfilePic();
			this.imageFile = undefined;
			this.imageUrl = "";
		} catch(error) {
			this.parent.serverError(error);

			this.saveButtonState = "error";
		}

		this.saveButtonState = "default";
		this.loading = false;
	}

	@action
	public onDragEnter() : void {
		this.isDraggingOver = true;
	}

	@action
	public onDragLeave() : void {
		this.isDraggingOver = false;
	}

}