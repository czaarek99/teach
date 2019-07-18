import { observable, action } from "mobx";
import { ISetting, IManySettingsInput } from "common-library";
import { ISettingsModel } from "../interfaces";

export class SettingsModel implements ISettingsModel {

	@observable public showEmail = false;
	@observable public showPhone = false;

	@action
	public fromJson(settings: ISetting[]) {
		for(const setting of settings) {
			this[setting.key] = setting.value;
		}
	}

	public toInput() : IManySettingsInput {
		return {
			changes: [
				{
					key: "showEmail",
					value: this.showEmail
				},
				{
					key: "showPhone",
					value: this.showPhone
				}
			]
		};
	}
}