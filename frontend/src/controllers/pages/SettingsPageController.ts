import { ISettingsPageController } from "../../interfaces/controllers/pages/ISettingsPageController";
import { observable, computed, action } from "mobx";
import { SettingsModel } from "../../models/SettingsModel";
import { createViewModel } from "mobx-utils";
import { ISettingsModel } from "../../interfaces/models/ISettingsModel";
import { LoadingButtonState } from "../../components";
import { HttpError, ErrorMessage } from "common-library";
import { successTimeout } from "../../util/successTimeout";
import { ViewModel } from "../../interfaces/ViewModel";
import { requireLogin } from "../../util/requireLogin";
import { RootStore } from "../../stores/RootStore";

export class SettingsPageController implements ISettingsPageController {

	@observable private readonly rootStore: RootStore;

	private successTimeout?: number;

	@observable private model = new SettingsModel();
	@observable public viewModel = createViewModel(this.model);
	@observable public saveButtonState : LoadingButtonState = "default";
	@observable public loading = true;
	@observable public errorMessage = "";

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;

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
		const isLoggedIn = await requireLogin(this.rootStore);
		if(!isLoggedIn) {
			return;
		}

		try {
			const settings = await this.rootStore.services.settingsService.getSettings();
			this.model.fromJson(settings);
		} catch(error) {
			this.serverError(error);
		}

		this.loading = false;
	}

	@action
	public onChange(key: keyof ISettingsModel, value: any) : void {
		this.viewModel[key] = value;
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

		const input = this.viewModel.toInput();

		try {
			await this.rootStore.services.settingsService.updateSettings(input);

			this.saveButtonState = "success";
			this.viewModel.submit();

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