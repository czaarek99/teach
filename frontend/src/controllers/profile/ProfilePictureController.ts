import { IProfilePictureController } from "../../interfaces/controllers/profile/IProfilePictureController";
import { observable, action } from "mobx";
import { LoadingButtonState } from "../../components";
import { IUserService } from "../../interfaces/services/IUserService";
import { IImageService } from "../../interfaces/services/IImageService";
import { successTimeout } from "../../util/successTimeout";
import { ProfilePageController } from "../pages/ProfilePageController";
import { IUserCache } from "../../util/UserCache";
import { getImageUrl } from "../../util/imageAPI";

export class ProfilePictureController implements IProfilePictureController {

	private readonly parent: ProfilePageController;
	private readonly userCache: IUserCache;
	private readonly userService: IUserService;
	private readonly imageService: IImageService;

	private imageFile: File;
	private successTimeout: number;

	@observable public loading = false;
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public isDraggingOver = false;
	@observable public imageUrl = "";

	constructor(
		parent: ProfilePageController,
		userCache: IUserCache,
		userService: IUserService,
		imageService :IImageService
	) {
		this.parent = parent;
		this.userCache = userCache;
		this.userService = userService;
		this.imageService = imageService;
	}

	public onUnmount() : void {
		if(this.imageUrl) {
			URL.revokeObjectURL(this.imageUrl);
		}
	}

	@action
	public async load() : Promise<void> {
		if(this.userCache.user) {
			this.imageUrl = getImageUrl(this.userCache.user.avatarFileName);
		}
	}

	@action
	public onDrop = (acceptedFiles: File[]) : void => {
		this.isDraggingOver = false;

		const image = acceptedFiles[0];
		this.imageFile = image;
		this.imageUrl = URL.createObjectURL(image);
	}

	@action
	public async onSave() : Promise<void> {
		if(this.imageFile) {
			clearTimeout(this.successTimeout);

			this.loading = true;
			this.saveButtonState = "loading";

			try {
				const id = await this.imageService.uploadImage(this.imageFile);
				await this.userService.updateProfilePicture({
					id
				});

				this.saveButtonState = "success";

				this.successTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				})
			} catch(error) {
				console.error(error);

				this.saveButtonState = "error";
			}

			this.loading = false;
		}
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