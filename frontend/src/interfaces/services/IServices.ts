import { IAuthenticationService } from "./IAuthenticationService";
import { IUserService } from "./IUserService";
import { IAdService } from "./IAdService";
import { ISettingsService } from "./ISettingsService";
import { IImageService } from "./IImageService";
import { IDMService } from "./IDMService";

export interface IServices {
	authenticationService: IAuthenticationService
	userService: IUserService
	adService: IAdService
	settingsService: ISettingsService
	imageService: IImageService
	dmService: IDMService
}