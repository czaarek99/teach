import { BaseService } from "./BaseService";
import { IManySettingsInput, ISetting } from "common-library";
import { ISettingsService } from "../interfaces";

export class SettingsService extends BaseService implements ISettingsService {

	constructor() {
		super("/settings");
	}

	public async updateSetting(setting: ISetting) : Promise<void> {
		await this.axios.patch("/", setting);
	}

	public async updateSettings(input: IManySettingsInput) : Promise<void> {
		await this.axios.patch("/many", input);
	}

	public async getSettings() : Promise<ISetting[]> {
		const response = await this.axios.get<ISetting[]>("/");
		return response.data;
	}
}
