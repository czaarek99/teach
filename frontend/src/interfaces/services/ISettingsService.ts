import { ISetting, IManySettingsInput } from "common-library";

export interface ISettingsService {
	updateSetting: (setting: ISetting) => Promise<void>
	updateSettings: (input: IManySettingsInput) => Promise<void>
	getSettings: () => Promise<ISetting[]>
}