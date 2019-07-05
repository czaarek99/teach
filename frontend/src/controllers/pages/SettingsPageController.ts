import { ISettingsPageController } from "../../interfaces/controllers/pages/ISettingsPageController";
import { observable, computed, action } from "mobx";
import { SettingsModel } from "../../models/SettingsModel";
import { createViewModel } from "mobx-utils";
import { ISettingsModel } from "../../interfaces/models/ISettingsModel";
import { LoadingButtonState } from "../../components";
import { ISettingsService } from "../../interfaces/services/ISettingsService";
import { HttpError, ErrorMessage } from "common-library";
import { successTimeout } from "../../util/successTimeout";
import { ViewModel } from "../../interfaces/ViewModel";

export class SettingsPageController implements ISettingsPageController {

	private readonly settingsService: ISettingsService;
	private successTimeout?: number;

	@observable private model = new SettingsModel();
	@observable public viewModel = createViewModel<ISettingsModel>(this.model);
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public loading = true;
	@observable public errorMessage = "";

	constructor(settingsService: ISettingsService) {
		this.settingsService = settingsService;

		this.load();
	}

	@computed
	public get showReset() : boolean {
		return this.viewModel.isDirty;
	}

	@action
	private serverError(error: any) : void {
		if(error instanceof HttpError) {
			this.errorMessage = error.error;
		} else {
			console.error(error);
			this.errorMessage = ErrorMessage.COMPONENT;
		}
	}

	@action
	private async load() : Promise<void> {

		try {
			const settings = await this.settingsService.getSettings();
			this.model.fromJson(settings);
		} catch(error) {
			this.serverError(error);
		}

		this.loading = false;
	}

	@computed
	private get _viewModel() : ViewModel<SettingsModel> {
		return this.viewModel as any;
	}

	@action
	public onChange(key: keyof ISettingsModel, value: any) : void {
		this._viewModel[key] = value;
	}

	@action
	public onReset() : void {
		this.viewModel.reset();
	}

	@action
	public async onSave() : Promise<void> {
		clearTimeout(this.successTimeout);

		this.saveButtonState = "loading";
		this.loading = true;

		this.viewModel.submit();

		try {
			const input = this.model.toJson();
			await this.settingsService.updateSettings(input);

			this.saveButtonState = "success";

			this.successTimeout = successTimeout(() => {
				this.saveButtonState = "default";
			});
		} catch(error) {
			this.saveButtonState = "error";
			this.serverError(error);
		}

		this.loading = false;
	}
}