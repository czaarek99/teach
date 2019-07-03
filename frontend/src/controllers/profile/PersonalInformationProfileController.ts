import { observable } from "mobx";
import { ErrorModel } from "../../validation/ErrorModel";
import { IPersonalInformationModel } from "../../interfaces/models/IPersonalInformationModel";
import { ViewModel } from "../../interfaces/ViewModel";
import { PersonalInformationModel } from "../../models/PersonalInformationModel";
import { createViewModel } from "mobx-utils";
import { IUserService } from "../../interfaces/services/IUserService";
import { IUserCache } from "../../util/UserCache";
import { minLength, maxLength } from "../../validation/validators";
import { ValidatorMap, validate } from "../../validation/validate";
import { LoadingButtonState } from "../../components";

import {
	IPersonalInformationProfileController,
	IPersonalErrorState
} from "../../interfaces/controllers/profile/IPersonalInformationProfileController";

import {
	FIRST_NAME_MAX_LENGTH,
	FIRST_NAME_MIN_LENGTH,
	PHONE_NUMBER_MAX_LENGTH
} from "common-library";
import { objectKeys } from "../../util/objectKeys";
import { successTimeout } from "../../util/successTimeout";

const personalValidators : ValidatorMap<IPersonalInformationModel> = {
	firstName: [
		minLength(FIRST_NAME_MIN_LENGTH),
		maxLength(FIRST_NAME_MAX_LENGTH)
	],

	lastName: [
		minLength(FIRST_NAME_MIN_LENGTH),
		maxLength(FIRST_NAME_MAX_LENGTH)
	],

	phoneNumber: [
		maxLength(PHONE_NUMBER_MAX_LENGTH)
	]
};

export class PersonalInformationProfileController implements IPersonalInformationProfileController {

	private readonly userService: IUserService;
	private readonly userCache: IUserCache;
	private saveButtonStateTimeout?: number;

	@observable private _viewModel : ViewModel<PersonalInformationModel>;
	@observable private model = new PersonalInformationModel();

	@observable public loading = true;
	@observable public saveButtonState: LoadingButtonState = "disabled";
	@observable public viewModel : ViewModel<IPersonalInformationModel>;

	@observable public errorModel = new ErrorModel<IPersonalErrorState>({
		firstName: [],
		lastName: [],
		phoneNumber: []
	});

	constructor(
		userService: IUserService,
		userCache: IUserCache
	) {
		this.userService = userService;
		this.userCache = userCache;

		this._viewModel = createViewModel(this.model);
		this.viewModel = this._viewModel as any;
	}

	public loadUserFromCache() : void {
		if(this.userCache.user) {
			this.model.fromJson(this.userCache.user);
		}
	}

	public async load() : Promise<void> {
		this.loading = false;
		this.saveButtonState = "default";
	}

	public onSave = async () : Promise<void> => {
		clearTimeout(this.saveButtonStateTimeout);

		this._viewModel.submit();
		this.errorModel.submit();

		for(const key of objectKeys(this.model.toInput())) {
			this.validate(key);
		}

		if(this.errorModel.hasErrors()) {
			this.saveButtonState = "error";
		} else {
			this.saveButtonState = "loading";

			const input = this.model.toInput();

			try {
				await this.userService.updatePersonalInfo(input);
				this.saveButtonState = "success";

				this.userCache.updatePersonalInfo(input);

				this.saveButtonStateTimeout = successTimeout(() => {
					this.saveButtonState = "default";
				});
			} catch(error) {
				this.saveButtonState = "error";
			}
		}
	}

	public onChange(key: keyof IPersonalInformationModel, value: any) : void {
		this._viewModel[key] = value;
		this.validate(key);
	}

	public onReset = () : void => {
		this._viewModel.reset();
		this.errorModel.reset();
	}

	private validate(key: keyof IPersonalInformationModel) : void {
		const keyValidators = personalValidators[key];

		if(keyValidators !== undefined) {
			const value = this._viewModel[key];
			this.errorModel.setErrors(key, validate(value, keyValidators));
		}
	}
}