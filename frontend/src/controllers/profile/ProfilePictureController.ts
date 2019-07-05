import { IProfilePictureController } from "../../interfaces/controllers/profile/IProfilePictureController";
import { observable, action, computed } from "mobx";
import { LoadingButtonState } from "../../components";
import { IImageService } from "../../interfaces/services/IImageService";
import { successTimeout } from "../../util/successTimeout";
import { ProfilePageController } from "../pages/ProfilePageController";
import { IUserCache } from "../../util/UserCache";
import { getImageUrl } from "../../util/imageAPI";

export class ProfilePictureController implements IProfilePictureController {

	private readonly parent: ProfilePageController;
	private readonly userCache: IUserCache;
	private readonly imageService: IImageService;

	private imageFile?: File;
	private successTimeout?: number;

	@observable public loading = false;
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public deleteButtonState : LoadingButtonState = "default";
	@observable public isDraggingOver = false;
	@observable public imageUrl = "";

	constructor(
		parent: ProfilePageController,
		userCache: IUserCache,
		imageService :IImageService
	) {
		this.parent = parent;
		this.userCache = userCache;
		this.imageService = imageService;
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
		const user = this.userCache.user;
		if(user && user.avatarFileName) {
			this.imageUrl = getImageUrl(user.avatarFileName);
		}
	}

	@action
	public onDrop = (file: File) : void => {
		this.isDraggingOver = false;

		this.imageFile = file;
		this.imageUrl = URL.createObjectURL(file);
	}

	@action
	public async onSave() : Promise<void> {
		if(this.imageFile) {
			clearTimeout(this.successTimeout);

			this.loading = true;
			this.saveButtonState = "loading";
			this.deleteButtonState = "disabled";

			try {
				const output = await this.imageService.updateProfilePic(this.imageFile);
				this.userCache.updateProfilePic(output.fileName);
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
			await this.imageService.deleteProfilePic();
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