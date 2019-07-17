import { observable, computed, action } from "mobx";
import { HttpError, ErrorMessage } from "common-library";
import { RootStore } from "../../stores";
import { ISettingsPageController, ISettingsModel } from "../../interfaces";
import { SettingsModel } from "../../models";
import { createViewModel } from "mobx-utils";
import { LoadingButtonState } from "../../components";
import { requireLogin, successTimeout } from "../../util";

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