import { ISettingsPageController } from "../../interfaces/controllers/pages/ISettingsPageController";
import { observable } from "mobx";
import { SettingsModel } from "../../models/SettingsModel";
import { createViewModel } from "mobx-utils";
import { ISettingsModel } from "../../interfaces/models/ISettingsModel";

export class SettingsPageController implements ISettingsPageController {

	@observable public model = createViewModel<ISettingsModel>(new SettingsModel());

}