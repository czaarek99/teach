import { IAuthenticationService } from "./IAuthenticationService";
import { IUserService } from "./IUserService";
import { IAdService } from "./IAdService";
import { ISettingsService } from "./ISettingsService";
import { IImageService } from "./IImageService";

export interface IServices {
	authenticationService: IAuthenticationService
	userService: IUserService
	adService: IAdService
	settingsService: ISettingsService
	imageService: IImageService
}